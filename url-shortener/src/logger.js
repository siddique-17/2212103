const subscribers=[];
const logger={
  info:(msg,ctx)=>subscribers.forEach(fn=>fn({level:"INFO", msg, ctx })),
  warn:(msg,ctx)=>subscribers.forEach(fn=>fn({level:"WARN", msg, ctx })),
  error:(msg,ctx)=>subscribers.forEach(fn=>fn({level:"ERROR", msg, ctx })),
  child:(bindings={}) => ({
    info:(m,c)=>logger.info(m,{...bindings,...c }),
    warn:(m,c)=>logger.warn(m,{...bindings,...c }),
    error:(m,c)=>logger.error(m,{...bindings,...c })
  }),
  subscribe:(fn) => { subscribers.push(fn); return () => subscribers.splice(subscribers.indexOf(fn), 1); }
};
export default logger;
