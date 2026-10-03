"""Actual browser evidence; run against the built local server, never a public URL."""
import json, os, pathlib, statistics, time, platform
from importlib.metadata import version
from playwright.sync_api import sync_playwright
OUT=pathlib.Path(os.environ.get('KN_EVIDENCE','evidence')); OUT.mkdir(parents=True,exist_ok=True)
URL='http://127.0.0.1:8876/'
checks=[]; errors=[]; external=[]; snapshots={}; performance={}
def check(name,condition,detail=None):
    checks.append({'name':name,'pass':bool(condition),'detail':detail})
    if not condition: raise AssertionError(f'{name}: {detail}')
def wait_frame(page):
    page.evaluate('() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))')
def snap(page): return page.evaluate('window.__KN_DEBUG__.snapshot()')
def ready(page):
    page.wait_for_function('window.__KN_DEBUG__?.ready',timeout=90000);wait_frame(page)

def exercise_doorway(page,label):
    """The actual DOM, focus and viewport can dissent from the data record."""
    page.locator('[data-act="RETURN"]').click();wait_frame(page)
    before=snap(page)
    origin_scroll=page.evaluate('scrollY')
    static_shape=page.locator('#fallback svg path').get_attribute('d')
    check(label+'_closed_by_default',not page.locator('#return-doorway').is_visible())
    page.locator('#understand-return').click();wait_frame(page)
    opened=snap(page)
    check(label+'_invoking_time_preserved',opened['seconds']==before['seconds'] and not opened['playing'])
    check(label+'_same_visible_carrier',
        (opened['fallback'] and page.locator('#fallback').is_visible() and page.locator('#fallback svg path').get_attribute('d')==static_shape)
        if before['fallback'] else
        (not opened['fallback'] and bool(before.get('uuid')) and opened['uuid']==before['uuid'] and opened['continuityUUID']==before['continuityUUID']))
    check(label+'_ordinary_region_not_modal',page.get_by_role('complementary',name='Quando l’esperienza diventa capacità.').is_visible() and page.locator('dialog[open]').count()==0)
    check(label+'_meaningful_open_focus',page.evaluate('document.activeElement.id')=='return-doorway-title')
    check(label+'_states_distinct_in_dom',
        page.locator('[data-knowledge-state="exercised"]').is_visible() and
        page.locator('[data-projection-state="illustrative_not_observed"]').is_visible())
    page.locator('[data-depth="mechanism"]').click();wait_frame(page)
    check(label+'_mechanism_selected',page.locator('#semantic-depth-title').inner_text()=='Il ritorno conserva ciò che cambia.')
    page.locator('[data-depth="source"]').click();wait_frame(page)
    check(label+'_one_depth_and_matching_content',
        page.locator('[data-depth][aria-pressed="true"]').count()==1 and
        page.locator('[data-depth="source"]').get_attribute('aria-pressed')=='true' and
        page.locator('#semantic-depth-title').inner_text()=='Il sapere dietro RETURN.')
    links=page.locator('.semantic-sources a').evaluate_all('(elements)=>elements.map(e=>({href:e.href,target:e.target,rel:e.rel}))')
    check(label+'_commit_bound_sources',len(links)==2 and all('/blob/e35403bcc9213a6805a03c77ca9889adbef4ecc4/' in x['href'] and x['target']=='_blank' and 'noopener' in x['rel'] for x in links),links)
    check(label+'_depth_changes_freeze_time',snap(page)['seconds']==opened['seconds'])
    geometry=page.evaluate('''() => {
      const box=id=>{const b=document.getElementById(id).getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom}};
      return {scene:box('experience'),rail:box('return-doorway'),width:innerWidth,
        overflow:document.documentElement.scrollWidth>innerWidth+1};
    }''')
    check(label+'_layout_preserves_scene_space',
        (geometry['scene']['right']<=geometry['rail']['left']+1 if geometry['width']>=1100
         else geometry['rail']['top']>=geometry['scene']['bottom']-1) and not geometry['overflow'],geometry)
    page.screenshot(path=str(OUT/(label+'_SOURCE.png')),full_page=geometry['width']<1100)
    page.locator('[data-depth="source"]').press('Escape');wait_frame(page)
    check(label+'_escape_restores_focus_and_scroll',not page.locator('#return-doorway').is_visible() and
        page.evaluate('document.activeElement.id')=='understand-return' and abs(page.evaluate('scrollY')-origin_scroll)<1)
    check(label+'_close_keeps_paused_time',snap(page)['seconds']==before['seconds'] and not snap(page)['playing'])
    page.locator('#understand-return').click();wait_frame(page)
    check(label+'_reopen_recovers_meaning',page.locator('[data-depth="meaning"]').get_attribute('aria-pressed')=='true')
    page.screenshot(path=str(OUT/(label+'_MEANING.png')),full_page=geometry['width']<1100)
    page.locator('#close-return').click();wait_frame(page)
    check(label+'_button_close_restores_opener',page.evaluate('document.activeElement.id')=='understand-return')

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=os.environ.get('KN_CHROMIUM_PATH') or None,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    context=browser.new_context(viewport={'width':1440,'height':900},device_scale_factor=1)
    page=context.new_page()
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.on('console',lambda msg: errors.append(msg.text) if msg.type=='error' else None)
    page.on('request',lambda req: external.append(req.url) if not req.url.startswith(URL) and not req.url.startswith('data:') else None)
    try:
        page.goto(URL+'?test=1',wait_until='networkidle',timeout=90000);ready(page)
        initial=snap(page);check('actual_webgl_not_fallback',not initial['fallback'])
        root=initial['uuid']; trace=initial['continuityUUID']
        # Silent captures happen first. Author visual review happens after artifact retrieval.
        page.evaluate('window.__KN_DEBUG__.silent(true)')
        for act in ['FORM','BUILD','LIVE','RETURN']:
            page.evaluate('([a,v]) => window.__KN_DEBUG__.seekAct(a,v)',[act,.90 if act=='RETURN' else .68]);wait_frame(page)
            snapshots[act]=snap(page)
            check('same_product_root_'+act,snapshots[act]['uuid']==root)
            check('same_continuity_root_'+act,snapshots[act]['continuityUUID']==trace)
            check('act_'+act,snapshots[act]['act']==act)
            b=snapshots[act]['projectedProductBounds'];check('whole_carrier_fits_'+act,b['left']>=0 and b['right']<=1440,b)
            page.screenshot(path=str(OUT/('SILENT_'+act+'.png')))
        page.evaluate('window.__KN_DEBUG__.silent(false)');wait_frame(page)
        for act in ['FORM','BUILD','LIVE','RETURN']:
            page.locator('[data-act="'+act+'"]').click();wait_frame(page)
            page.screenshot(path=str(OUT/(act+'.png')))
        check('return_has_qualified_destination',snap(page)['returnStage']=='proposed_design_criterion')
        end=page.evaluate("() => {const p=document.getElementById('return-line');const q=p.getPointAtLength(p.getTotalLength());return {x:q.x,y:q.y}}")
        dest=snap(page)['relationEndpoints']['destination']
        check('return_lands_on_criterion_anchor',abs(end['x']-dest['x'])<1 and abs(end['y']-dest['y'])<1)
        check('return_is_not_automatic',snap(page)['returnExample']['automaticApplication'] is False)
        check('no_fabricated_mesh_separation',snap(page)['manipulatedSubmeshes']==[])
        check('no_external_runtime_requests',external==[],external)
        # Rapid reversal must settle on the final requested act, with the same root.
        page.evaluate("() => { for(const a of ['FORM','RETURN','BUILD','LIVE','FORM'])window.__KN_DEBUG__.seekAct(a); }")
        wait_frame(page);check('rapid_reversal_final_state',snap(page)['act']=='FORM' and snap(page)['uuid']==root)
        page.locator('#play').click();time.sleep(2);wait_frame(page)
        check('play_progresses',snap(page)['playing'] and snap(page)['seconds']>6.8)
        page.locator('#play').click();performance['FORM']=snap(page)['performanceSamples'];before=snap(page)['seconds'];time.sleep(.5);wait_frame(page)
        check('pause_freezes',snap(page)['seconds']==before)
        page.locator('#inspect').click();wait_frame(page)
        check('inspect_pauses_and_is_bounded',snap(page)['inspection'] and not snap(page)['playing'])
        old_camera=snap(page)['camera'];page.mouse.move(1080,430);page.mouse.down();page.mouse.move(1150,450,steps=5);page.mouse.up();wait_frame(page)
        check('inspect_drag_changes_camera',snap(page)['camera']!=old_camera)
        page.locator('#inspect').click();wait_frame(page);check('guided_recovery',not snap(page)['inspection'])
        page.locator('#replay').click();wait_frame(page);check('replay_returns_form',snap(page)['act']=='FORM')
        page.locator('#play').click()
        page.locator('#about').click();check('attribution_visible',page.get_by_text('angelo raffaele catalano',exact=True).is_visible())
        page.keyboard.press('Escape');check('dialog_returns_focus',page.locator('#about').evaluate('(e)=>document.activeElement===e'))
        page.locator('[data-act="RETURN"]').focus();page.keyboard.press('Enter');wait_frame(page)
        check('keyboard_selects_state',snap(page)['act']=='RETURN')
        page.evaluate('window.__KN_DEBUG__.seek(46)');wait_frame(page);check('end_holds_return',snap(page)['act']=='RETURN' and not snap(page)['playing'])
        exercise_doorway(page,'DESKTOP_RETURN')
        # Public commands replace the semantic view coherently; it never owns time.
        page.locator('#understand-return').click();page.locator('[data-act="LIVE"]').click();wait_frame(page)
        check('phase_change_closes_doorway',not page.locator('#return-doorway').is_visible() and snap(page)['act']=='LIVE' and not page.locator('#understand-return').is_visible())
        page.locator('[data-act="RETURN"]').click();page.locator('#understand-return').click()
        page.locator('#timeline').press('Home');wait_frame(page)
        check('keyboard_scrub_closes_doorway',not page.locator('#return-doorway').is_visible() and snap(page)['act']=='FORM')
        page.locator('[data-act="RETURN"]').click();page.locator('#understand-return').click();page.locator('#play').click();wait_frame(page)
        check('explicit_play_closes_and_resumes',not page.locator('#return-doorway').is_visible() and snap(page)['playing'])
        page.locator('#understand-return').click();wait_frame(page)
        playing_open=snap(page);time.sleep(.15);wait_frame(page)
        check('opening_from_playback_pauses_current_frame',not playing_open['playing'] and snap(page)['seconds']==playing_open['seconds'])
        page.locator('#inspect').click();wait_frame(page)
        check('inspection_replaces_doorway',not page.locator('#return-doorway').is_visible() and snap(page)['inspection'] and not page.locator('#understand-return').is_visible())
        page.locator('#inspect').click();wait_frame(page)
        page.locator('#understand-return').click();page.locator('#about').click();wait_frame(page)
        check('source_dialog_replaces_doorway',page.locator('#details').is_visible() and not page.locator('#return-doorway').is_visible())
        page.keyboard.press('Escape');check('source_dialog_focus_still_recovers',page.evaluate('document.activeElement.id')=='about')
        page.locator('#understand-return').click();page.locator('#replay').click();wait_frame(page)
        check('replay_replaces_doorway_with_form',not page.locator('#return-doorway').is_visible() and snap(page)['act']=='FORM')
        page.locator('[data-act="RETURN"]').click()
        page.evaluate('''() => {
          const click=s=>document.querySelector(s).click();
          click('#understand-return');click('[data-depth="source"]');click('#close-return');
          click('#understand-return');click('[data-depth="mechanism"]');click('[data-act="LIVE"]');
          click('[data-act="RETURN"]');
        }''');wait_frame(page)
        page.locator('#understand-return').click();page.locator('[data-depth="source"]').click();wait_frame(page)
        check('rapid_public_commands_settle_on_last_depth',snap(page)['act']=='RETURN' and
            page.locator('[data-depth][aria-pressed="true"]').count()==1 and
            page.locator('[data-depth="source"]').get_attribute('aria-pressed')=='true')
        page.keyboard.press('Escape');wait_frame(page)
        for width,height,label in [(1440,600,'LOW_DESKTOP_RETURN'),(1024,768,'TABLET_RETURN'),(390,844,'MOBILE_RETURN'),(320,568,'SMALL_MOBILE_RETURN')]:
            page.set_viewport_size({'width':width,'height':height});wait_frame(page)
            exercise_doorway(page,label)
        page.set_viewport_size({'width':1440,'height':900});wait_frame(page)
        check('doorway_no_implicit_external_requests',external==[],external)
        # Geometric bounds, not a claim of real-device usability or general accessibility.
        for width,height,label in [(1024,768,'TABLET'),(390,844,'MOBILE')]:
            page.set_viewport_size({'width':width,'height':height});wait_frame(page)
            for act in ['LIVE','RETURN']:
                page.locator('[data-act="'+act+'"]').click();wait_frame(page);page.screenshot(path=str(OUT/(label+'_'+act+'.png')))
                box=snap(page)['projectedProductBounds'];check(label+'_'+act+'_whole_carrier_fits',box['left']>=0 and box['right']<=width,box)
            bounds=page.evaluate("[...document.querySelectorAll('footer button,header,.intro')].map(e=>({name:e.id||e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}))")
            check(label+'_controls_within_viewport',all(b['left']>=0 and b['right']<=width+.5 and b['top']>=0 and b['bottom']<=height+.5 for b in bounds),bounds)
        page.set_viewport_size({'width':1440,'height':900});wait_frame(page)
        page.locator('[data-act="LIVE"]').click();page.locator('#play').click();time.sleep(3);page.locator('#play').click();wait_frame(page)
        performance['LIVE']=snap(page)['performanceSamples']
        # A true real-time browser recording, not interpolated screenshots.
        video_context=browser.new_context(viewport={'width':1280,'height':800},device_scale_factor=1,record_video_dir=str(OUT/'video'),record_video_size={'width':1280,'height':800})
        video_page=video_context.new_page();video_page.on('pageerror',lambda e:errors.append(str(e)));video_page.goto(URL,wait_until='networkidle',timeout=90000)
        video_page.wait_for_function("document.getElementById('loading').hidden",timeout=90000)
        video_page.wait_for_function("document.getElementById('timeline').value === '46'",timeout=90000)
        video_page.screenshot(path=str(OUT/'AUTOPLAY_END.png'));video_context.close()
        check('guided_autoplay_reaches_return',True)
        page.emulate_media(reduced_motion='reduce');page.reload(wait_until='networkidle');ready(page)
        before=snap(page)['seconds'];time.sleep(.5);check('reduced_motion_no_autoplay',not snap(page)['playing'] and snap(page)['seconds']==before)
        page.locator('#replay').click();wait_frame(page);check('reduced_replay_no_autoplay',not snap(page)['playing'])
        page.locator('[data-act="RETURN"]').click();wait_frame(page);page.screenshot(path=str(OUT/'REDUCED_RETURN.png'))
        check('reduced_motion_preserves_destination',snap(page)['returnStage']=='proposed_design_criterion')
        exercise_doorway(page,'REDUCED_RETURN_DOORWAY')
        check('normal_console_errors_empty',errors==[],errors)
        # Wrong asset is intercepted locally; it cannot become a new product by accident.
        bad=context.new_page();bad.route('**/models/yacht.glb',lambda route:route.fulfill(status=200,body='wrong model',content_type='model/gltf-binary'))
        bad.goto(URL+'?test=1',wait_until='networkidle');ready(bad)
        check('unverified_asset_falls_back',snap(bad)['fallback'])
        bad.screenshot(path=str(OUT/'ASSET_FAILURE.png'));bad.close()
        page.goto(URL+'?test=1&static=1',wait_until='networkidle');ready(page)
        check('static_fallback_available',snap(page)['fallback'])
        page.locator('[data-act="RETURN"]').click();wait_frame(page);page.screenshot(path=str(OUT/'STATIC_RETURN.png'))
        check('static_controls_preserve_relation',snap(page)['currentAct']=='RETURN' and snap(page)['returnStage']=='proposed_design_criterion')
        exercise_doorway(page,'STATIC_RETURN_DOORWAY')
        page.set_viewport_size({'width':390,'height':844});wait_frame(page)
        exercise_doorway(page,'MOBILE_STATIC_RETURN_DOORWAY')
        check('all_depth_modes_no_external_requests',external==[],external)
        # The endpoints are checked against visible source/consumer elements,
        # not against a second copy of the implementation's chosen coordinates.
        for width,height,label in [(1440,900,'DESKTOP'),(390,844,'MOBILE')]:
            page.set_viewport_size({'width':width,'height':height});wait_frame(page)
            for act in ['FORM','RETURN']:
                page.locator('[data-act="'+act+'"]').click();wait_frame(page)
                anchors=page.evaluate('''() => {
                  const center=e=>{const b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}};
                  const path=document.getElementById('return-line');
                  return {source:center(document.querySelector('#fallback circle')),
                    destination:center(document.querySelector('#access-diagram circle')),
                    start:{x:path.getPointAtLength(0).x,y:path.getPointAtLength(0).y},
                    end:{x:path.getPointAtLength(path.getTotalLength()).x,y:path.getPointAtLength(path.getTotalLength()).y}};
                }''')
                for endpoint,target in [('start','source'),('end','destination')]:
                    check(label+'_static_'+act+'_'+endpoint+'_attached',
                        abs(anchors[endpoint]['x']-anchors[target]['x'])<1 and abs(anchors[endpoint]['y']-anchors[target]['y'])<1,anchors)
            page.screenshot(path=str(OUT/(label+'_STATIC_RETURN.png')))
        check('fallback_does_not_claim_same_geometry',page.locator('#scene-boundary').inner_text()=='SCHEMA ALTERNATIVO · STESSA RELAZIONE')
    finally:
        (OUT/'browser-evidence.json').write_text(json.dumps({'browser':browser.version,'playwright':version('playwright'),'runner':os.environ.get('KN_RUNNER',platform.platform()+' / software WebGL'),
            'performance':performance,'checks':checks,'consoleErrors':errors,'externalRequests':external,'snapshots':snapshots},indent=2),encoding='utf-8')
        browser.close()
