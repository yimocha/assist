import { cookie, addEvent, removeEvent, parseTagText } from '../utils'
import audioTabText, { symbolsReg } from '../constans'
import Audio from '../Audio';

import styles from './index.scss'
import { BigTextHtml, BigTextBone } from './index.tmpl.js'

const BigText = {
    init(core) {
        const { namespace } = core.config
        this.body = document.body
        this.namespace = namespace
        this.pinyin = cookie.get('pinyin', namespace)
        this.jianti = cookie.get('jianti', namespace)
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
    },
    addEventMove() {
        addEvent(this.body, 'mouseover', this.mouseOver)
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
        const activeBtn = document.getElementById(`${namespace}-bigtext-content`)

        let text = parseTagText(target).replace(symbolsReg, '')

        if (this.pinyin) {
            if ("undefined" != typeof PinyinHelper) {
                console.log('text:', text)
                let t = PinyinHelper.convertToPinyin(text, PinyinFormat.WITH_TONE_MARK)
                console.log('t:', t)
                let r = "";
                for (var n = 0; n < t.length; n++) {
                    r += '<div class="pinyin ariaskiptheme">' + '<ariab class="ariaskiptheme"><ariai class="ariaskiptheme">' + t[n].v + '</ariai><ariai class="ariaskiptheme">' + t[n].key + "</ariai></ariab>" + "</div>"
                }
                activeBtn.innerHTML = r
            }
        } else {
            activeBtn.innerText = text
        }

        if (__isAssist || activeBtn.innerText == '文本') {
            activeBtn.innerText = ''
            return
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