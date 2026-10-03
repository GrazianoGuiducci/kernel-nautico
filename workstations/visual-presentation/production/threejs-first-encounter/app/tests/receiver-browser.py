"""Capture real UI requests; optionally replay recorded real-receiver answers, not new inference."""
import json,os,pathlib,hashlib
from playwright.sync_api import sync_playwright
OUT=pathlib.Path(os.environ.get('KN_EVIDENCE','evidence'))/'receiver';OUT.mkdir(parents=True,exist_ok=True)
RECORDS=pathlib.Path('tests/receiver-records');URL='http://127.0.0.1:8876/'
checks=[];errors=[];network=[]
def check(name,value):
 checks.append({'name':name,'passed':bool(value)})
 if not value:raise AssertionError(name)
def settle(p):p.evaluate('() => new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
def focus(p):return p.evaluate('window.KN_FOCUS.snapshot()')
def import_result(p,result):
 p.locator('#receiver-import').set_input_files({'name':'reply.json','mimeType':'application/json','buffer':json.dumps(result).encode()});settle(p)
try:
 with sync_playwright() as w:
  browser=w.chromium.launch(headless=True,executable_path=os.environ.get('KN_CHROMIUM_PATH') or None,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  for case in ['A','C']:
   page=browser.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('console',lambda e:errors.append(e.text) if e.type=='error' else None)
   page.on('request',lambda e:network.append(e.url) if not e.url.startswith((URL,'data:','blob:')) else None)
   page.goto(URL+'?test=1',wait_until='networkidle');page.wait_for_function('window.KN_RECEIVER && window.KN_FOCUS')
   act='LIVE' if case=='A' else 'RETURN'
   page.locator(f'[data-act="{act}"]').click();settle(page)
   if case=='A':page.locator('#focus-anchor').click()
   else:page.locator('#focus-toggle').click()
   settle(page);page.locator('#receiver-panel > summary').click()
   question='Cosa manca qui?' if case=='A' else 'Cosa cambia per il progetto?'
   page.locator('#receiver-question').fill(question)
   with page.expect_download() as d:page.locator('#receiver-export').click()
   dest=OUT/f'REQUEST_{case}.json';d.value.save_as(dest)
   request=json.loads(dest.read_text());check(case+'_download_matches_snapshot',request==page.evaluate('window.KN_RECEIVER.snapshot().request'))
   check(case+'_target_from_ui',request['focus']==focus(page));check(case+'_question_without_target',request['question']==question)
   check(case+'_not_live_api',request['transport']=='manual_file_handoff_not_live_api')
   page.screenshot(path=str(OUT/f'REQUEST_{case}.png'))
   record=RECORDS/f'EXCHANGE_{case}.json'
   if record.exists():
    exchange=json.loads(record.read_text());captured=exchange['request'];result=exchange['result']
    # Exact original request, explicitly restored in test-only replay after state equality.
    page.evaluate('(r)=>window.__KN_RECEIVER_TEST__.restoreCaptured(r)',captured)
    check(case+'_captured_request_exact',page.evaluate('window.KN_RECEIVER.snapshot().request')==captured)
    old=focus(page)
    wrong=dict(result,request_id='wrong-request');import_result(page,wrong)
    check(case+'_wrong_request_rejected',page.evaluate('window.KN_RECEIVER.snapshot().result') is None and focus(page)==old)
    forbidden=dict(result,effect_class='execute');import_result(page,forbidden)
    check(case+'_execution_rejected',page.evaluate('window.KN_RECEIVER.snapshot().result') is None and focus(page)==old)
    import_result(page,result)
    page.wait_for_function('window.KN_RECEIVER.snapshot().result !== null')
    check(case+'_import_does_not_change_focus',focus(page)==old)
    check(case+'_answer_text_exact',page.locator('#receiver-answer-text').inner_text()==result['answer'])
    page.locator('#receiver-answer').scroll_into_view_if_needed();page.screenshot(path=str(OUT/f'RESULT_{case}.png'))
    if result.get('focus_target'):
     page.locator('#receiver-show').click();settle(page)
     check(case+'_returned_target_accepted',focus(page)['field']['address']['semantic_id']==result['focus_target'])
     check(case+'_no_product_effect',not focus(page)['field']['capabilities']['execute'])
     check(case+'_applied_once',page.evaluate('window.KN_RECEIVER.snapshot().applied'))
     check(case+'_old_answer_cannot_reapply',page.locator('#receiver-show').is_disabled())
    # Explicitly tested as data-only, never proof of another model call.
    (OUT/f'REPLAY_{case}.json').write_text(json.dumps({'kind':'recorded_exchange_replay_not_new_inference','exchange_sha256':hashlib.sha256(record.read_bytes()).hexdigest(),'state':page.evaluate('window.KN_RECEIVER.snapshot()')},ensure_ascii=False,indent=2))
   page.close()
  page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  page.goto(URL+'?test=1&static=1',wait_until='networkidle');page.wait_for_function('window.KN_RECEIVER')
  page.locator('#focus-anchor').tap();settle(page);page.locator('#receiver-panel > summary').tap()
  page.locator('#receiver-export').scroll_into_view_if_needed();page.screenshot(path=str(OUT/'MOBILE_HANDOFF.png'))
  check('mobile_controls_in_panel',page.locator('#receiver-export').is_visible())
  check('replay_not_live_claim', 'Nessun modello collegato' in page.locator('#receiver-panel').inner_text())
  page.close();browser.close()
 check('no_page_console_errors',not errors);check('no_external_runtime_requests',not network)
finally:
 (OUT/'browser.json').write_text(json.dumps({'checks':checks,'errors':errors,'external_requests':network,'kind':'request_capture_and_optional_recorded_answer_replay'},ensure_ascii=False,indent=2))
 print(f'{sum(c["passed"] for c in checks)}/{len(checks)} receiver checks')
