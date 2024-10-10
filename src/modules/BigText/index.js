import { cookie, addEvent, removeEvent, parseTagText } from '../utils'
import audioTabText, { symbolsReg } from '../constans'
import Audio from '../Audio';

import styles from './index.scss'
import { BigTextHtml, BigTextBone } from './index.tmpl.js'

const BigText = {

    mouseOverTimeout: null,
    
    init(core) {
        const { namespace } = core.config
        
        this.body = document.body
        this.namespace = namespace
        this.pinyin = cookie.get('pinyin', namespace) || true
        this.jianti = cookie.get('jianti', namespace) || true
        core.creatStyle('bigtext-style', styles)
        core.creatHtml('bigtext-html', BigTextHtml)
        core.creatHtml('bigtext-bone', BigTextBone)
    },
    setEvents(core) {
        const { namespace } = core.config
        addEvent(window, 'DOMContentLoaded', () => {
            if (cookie.get('bigtext', namespace)) {
                this.show(core)
            }
        })
        this.toggleBigText(core, namespace)
        this.togglePinyin(core, namespace)
        this.toggleJianti(core, namespace)
    },
    togglePinyin(core, namespace) {
        const pinyinBtn = document.getElementById(`${namespace}-accscreen-py`)
        pinyinBtn.onclick = () => {
            if (this.pinyin) {
                this.pinyin = false
                pinyinBtn.setAttribute('title', audioTabText.pinyinClose)
                this.putTextToBigText(audioTabText.pinyinClose)
                Audio.playAudio(audioTabText.pinyinClose)
            } else {
                this.pinyin = true
                pinyinBtn.setAttribute('title', audioTabText.pinyinOpen)
                this.putTextToBigText(audioTabText.pinyinOpen)
                Audio.playAudio(audioTabText.pinyinOpen)
            }
            cookie.set('pinyin', this.pinyin, namespace)
        }
    },
    toggleJianti(core, namespace) {
        const jiantiBtn = document.getElementById(`${namespace}-accscreen-jt`)
        jiantiBtn.onclick = () => {
            if (this.jianti) {
                this.jianti = false
                jiantiBtn.setAttribute('title', audioTabText.jiantiClose)
                jiantiBtn.innerText = '简体'
                this.putTextToBigText(audioTabText.jiantiClose)
                Audio.playAudio(audioTabText.jiantiClose)
            } else {
                this.jianti = true
                jiantiBtn.setAttribute('title', audioTabText.jiantiOpen)
                jiantiBtn.innerText = '繁体'
                this.putTextToBigText(audioTabText.jiantiOpen)
                Audio.playAudio(audioTabText.jiantiOpen)
            }
            cookie.set('jianti', this.jianti, namespace)
        }
    },
    addEventMove() {
        addEvent(this.body, 'mouseover', this.mouseOver)
        // 当鼠标移开元素时清除计时器
        document.addEventListener('mouseout', function (event) {
            clearTimeout(BigText.mouseOverTimeout);
        });
    },
    removeEventMove() {
        removeEvent(this.body, 'mouseover', this.mouseOver)
    },
    toggleBigText(core, namespace) {
        const tabBarBtn = document.getElementById(`${namespace}-bigtext`)
        const tabBarBtnImg = tabBarBtn.getElementsByTagName('img')[0]
        const tabBarBtnClose = document.getElementById(`${namespace}-bigtext-close`)
        tabBarBtn.onclick = () => {
            const activeBtn = document.getElementById(`${namespace}-bigtext-html`)
            if (activeBtn.style.display == 'block') {
                this.reset(core)
                Audio.playAudio(audioTabText.bigtextClose)
                tabBarBtnImg.src = tabBarBtnImg.getAttribute('source-src')
            } else {
                this.show(core)
                Audio.playAudio(audioTabText.bigtextOpen)
                tabBarBtnImg.src = tabBarBtnImg.getAttribute('selected-src')
            }
        }

        tabBarBtnClose.onclick = () => {
            this.reset(core)
            Audio.playAudio(audioTabText.bigtextClose)
        }
    },
    mouseOver(event) {
        var event = window.event || event;
        var target = event.target || event.srcElement;
        const { namespace } = BigText
        var __parentNodeId = target.parentNode.id
        var __isAssist = __parentNodeId.indexOf(namespace) > -1

        if (target.classList.contains('ariaskiptheme')) {
            return
        }
        if (__isAssist) {
            return
        }

        BigText.mouseOverTimeout = setTimeout(() => {
            BigText.showBigText(target)
        }, 500);
    },
    showBigText(target) {
        let text = parseTagText(target).replace(symbolsReg, '')
        this.putTextToBigText(text)
    },
    putTextToBigText(text) {
        const { namespace } = BigText
        var pinyin = cookie.get('pinyin', namespace)
        var jianti = cookie.get('jianti', namespace)
        const activeBtn = document.getElementById(`${namespace}-bigtext-content`)
        if (!jianti) {
            text = ChineseHelper.convertToTraditionalChinese(text)
        }
        if (pinyin) {
            if ("undefined" != typeof PinyinHelper) {
                // console.log('text:', text)
                let t = PinyinHelper.convertToPinyin(text, PinyinFormat.WITH_TONE_MARK)
                // console.log('pinyin:', t)
                let html = ''
                activeBtn.textContent = ''
                for (var n = 0; n < t.length; n++) {
                    html += `<div class="pinyin ariaskiptheme">
                            <ariab class="ariaskiptheme">
                                <ariai class="ariaskiptheme">${t[n].v}</ariai>
                                <ariai class="ariaskiptheme">${jianti ? t[n].key : ChineseHelper.convertToTraditionalChinese(t[n].key)}</ariai>
                            </ariab>
                          </div>`
                }
                activeBtn.innerHTML = html
            }
        } else {
            activeBtn.innerText = text
        }
    },
    show(core) {
        const { namespace } = core.config
        const activeBtn = document.getElementById(`${namespace}-bigtext-html`)
        const tabBar = document.getElementById(`${namespace}-bigtext-bone`)
        activeBtn.style.display = 'block'
        tabBar.style.display = 'block'
        this.addEventMove()
        cookie.set('bigtext', true, namespace)
        core.message.publish('bigTextState', true)
    },
    reset(core) {
        const { namespace } = core.config
        const activeBtn = document.getElementById(`${namespace}-bigtext-html`)
        const tabBar = document.getElementById(`${namespace}-bigtext-bone`)
        activeBtn.style.display = 'none'
        tabBar.style.display = 'none'
        this.removeEventMove()

        const tabBarBtn = document.getElementById(`${namespace}-bigtext`)
        const tabBarBtnImg = tabBarBtn.getElementsByTagName('img')[0]
        tabBarBtnImg.src = tabBarBtnImg.getAttribute('source-src')

        cookie.set('bigtext', false, namespace)
        core.message.publish('bigTextState', false)
    }
};

export default BigText;