const BigTextHtml = (namespace) => {
     return `<div id='${namespace}-bigtext-html' class='bigtext-html'>
           <div id='${namespace}-bigtext-content' class='bigtext-html-content'></div>
           <div class='bigtext-html-btn' id='${namespace}-bigtext-close'>
              <span class='bigtext-html-close' role='button' title='关闭大字幕模式'>X</span>
           </div>
        </div>`
}

const BigTextBone = () => {
   return `<div class='bigtext-html-bone'></div>`
}

export {
   BigTextHtml,
   BigTextBone
};