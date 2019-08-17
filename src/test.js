import {eBar} from './components/bar/index.js'
window.onload=function(){
	var chart=new eBar({
		data:{
			el:document.getElementById('test'),
			columns:[],
			rows:[]
		}
	})
}