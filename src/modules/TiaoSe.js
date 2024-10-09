import { cookie, addEvent, removeEvent } from './utils'
import audioTabText from './constans'
import Audio from './Audio';

const TiaoSe = {
	init(core) {
		const { namespace } = core.config
		this.size = cookie.get('tiaose', namespace) || ""
		this.ignore = ['LINK', 'SCRIPT']
		this.namespace = namespace
		//this.body =  document.body
		this.set()

	},
	setEvents(core) {
		const { namespace } = core.config
		document.getElementById(`${namespace}-tiaose`).onclick = () => {
			this.tiaose(core)
		}
		addEvent(window, 'DOMContentLoaded', () => {
			this.updateTiaoseState(core)
		})
		//按钮颜色
		this.updateBtnColor('blue')
	},
	updateTiaoseState(core) {
		let { message } = core
		message.publish('tiaoseState', this.size)
	},
	tiaose(core) {
		var arr = [
			{
				name: 'blue',
				color: "red"
			}, {
				name: 'red',
				color: "yellow"
			}, {
				name: 'yellow',
				color: "black"
			}]

		//const found = arr.find(elem => elem.name === this.size);
		let mysize = this.size
		console.log('mysize:' + mysize)
		const found = arr.findIndex(function (val) {
			return val.name == mysize
		})
		if (found < 2) {
			this.size = arr[found + 1].name;
		}
		else {
			this.size = ""
		}
		console.log(found + 1, found)

		let nextColor = arr.find(f => f.name == this.size)?.color
		if (nextColor) {
			this.updateBtnColor(nextColor)
		} else {
			this.updateBtnColor('blue')
		}

		// this.size = parseFloat((this.size+0.1).toFixed(10));  
		this.updateTiaoseState(core)
		this.set();
		Audio.playAudio(audioTabText.tiaose)
	},
	set() {
		document.body.style.backgroundColor = this.size;
		if (this.size == "black") {
			// console.log("black")

			[].forEach.call(document.body.children, (el) => {
				const __el = el.tagName.toUpperCase()
				if (this.ignore.indexOf(__el) > -1 || el.id == this.namespace) {
					return
				}

				el.style.color = "white!important"
				//el.style.transformOrigin = '0px 0px'
			});

		}

		console.log("tiaose", document.body.style)

		cookie.set('tiaose', this.size, this.namespace)
	},
	updateBtnColor(color) {
		const namespace = this.namespace
		const BtnTiaose = document.getElementById(`${namespace}-tiaose`)
		const BtnTiaoseImg = BtnTiaose.getElementsByTagName('img')[0]
		BtnTiaoseImg.style.border = `1px white solid`
		BtnTiaoseImg.style.backgroundColor = color
	},
	reset() {
		this.size = ""
		this.set()
		this.updateBtnColor('blue')
	}

};

export default TiaoSe;