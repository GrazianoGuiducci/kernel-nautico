import { ACTS } from '../data/story.js';
export const clamp = (x,a=0,b=1) => Math.min(b,Math.max(a,x));
export const smooth = x => {const v=clamp(x);return v*v*(3-2*v);};
export const STARTS = ACTS.map((_,i)=>ACTS.slice(0,i).reduce((n,a)=>n+a.duration,0));
export const DURATION = ACTS.reduce((n,a)=>n+a.duration,0);
export function frameAt(seconds) {
  if(!Number.isFinite(seconds)) throw new TypeError('Time must be finite.');
  const t=clamp(seconds,0,DURATION);
  let index=ACTS.length-1;
  for(let i=0;i<ACTS.length;i++) if(t<STARTS[i]+ACTS[i].duration){index=i;break;}
  const act=ACTS[index], progress=clamp((t-STARTS[index])/act.duration);
  return {seconds:t,index,currentAct:act.id,progress,act,ended:t>=DURATION};
}
export function actTime(id,progress=.68){
  const index=ACTS.findIndex(a=>a.id===id);
  if(index<0||!Number.isFinite(progress))throw new RangeError('Unknown act/progress.');
  return STARTS[index]+clamp(progress)*ACTS[index].duration;
}
export function createTimeline({reducedMotion=false}={}){
  let seconds=0, playing=!reducedMotion;
  return {
    get seconds(){return seconds;},get playing(){return playing;},
    get frame(){return frameAt(seconds);},
    pause(){playing=false;},
    play(){if(seconds>=DURATION)seconds=0;playing=true;},
    seek(t){seconds=frameAt(t).seconds;playing=false;return this.frame;},
    replay(){seconds=0;playing=!reducedMotion;},
    tick(dt){if(!Number.isFinite(dt)||dt<0)throw new RangeError('Invalid elapsed time.');
      if(playing){seconds=clamp(seconds+dt,0,DURATION);if(seconds===DURATION)playing=false;}return this.frame;},
    setReduced(value){reducedMotion=Boolean(value);if(reducedMotion)playing=false;}
  };
}
