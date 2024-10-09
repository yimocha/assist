const BigTextHtml = (namespace) => {
   return `<div id='${namespace}-bigtext-html' class='bigtext-html'>
           <div id='${namespace}-bigtext-content' class='bigtext-html-content'></div>
           <ariali class="bigtext-html-tool">
               <div class='bigtext-html-btn' id='${namespace}-bigtext-close'>
                  <i class='bigtext-html-close' role='button' title='当前大字幕已开启，关闭大字幕请按Ctrl+Alt+B'>X</i>
               </div>
               <arialabel id="${namespace}-accscreen-py" class="ariaPYTitle bigtext-html-tool-btn" title="拼音已启用">拼音</arialabel>
               <arialabel id="${namespace}-accscreen-jt" class="ariaFontTitle bigtext-html-tool-btn" title="简体已启用">繁体</arialabel>
           </ariali>
        </div>`
}

const BigTextBone = () => {
   return `<div class='bigtext-html-bone'></div>`
}

export {
   BigTextHtml,
   BigTextBone
};