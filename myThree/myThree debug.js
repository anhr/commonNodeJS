/**
 * @module MyThree
 * @description I use MyThree in my projects for displaying of my 3D objects in the canvas.
 * @copyright 2011 Data Arts Team, Google Creative Lab
 *
 * @license under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 */

//import cookie from 'https://raw.githack.com/anhr/commonNodeJS/master/cookieNodeJS/cookie.js';
//import cookie from '../cookieNodeJS/cookie.js';

//import Player from '../player/player.js';
//import loadFile from '../loadFileNodeJS/loadFile.js';
//import MyPoints from '../myPoints/myPoints.js';

//import StereoEffect from '../StereoEffect/StereoEffect.js';
//import StereoEffect from 'https://raw.githack.com/anhr/commonNodeJS/master/StereoEffect/StereoEffect.js';

//import CanvasMenu from '../canvasMenu/canvasMenu.js';
//import CanvasMenu from 'https://raw.githack.com/anhr/commonNodeJS/master/canvasMenu/canvasMenu.js';

//import { getLanguageCode } from '../lang.js';
//import { getLanguageCode } from 'https://raw.githack.com/anhr/commonNodeJS/master/lang.js';

//import CreateFullScreenSettings from '../createFullScreenSettings.js';

//import AxesHelper from '../AxesHelper/AxesHelper.js';
//import AxesHelper from 'https://raw.githack.com/anhr/commonNodeJS/master/AxesHelper/AxesHelper.js';
//import AxesHelperGui from '../AxesHelper/AxesHelperGui.js';
//import AxesHelperGui from 'https://raw.githack.com/anhr/commonNodeJS/master/AxesHelper/AxesHelperGui.js';

//WARNING: Multiple instances of Three.js being imported. Use Options.createOrbitControls(...) http://localhost/anhr/commonNodeJS/master/jsdoc/Options/Options.html#createOrbitControls
//import { OrbitControls } from 'http://localhost/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from '../../../three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://raw.githack.com/anhr/three.js/dev/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

//import OrbitControlsGui from '../OrbitControls/OrbitControlsGui.js';
//import OrbitControlsGui from 'http://localhost/anhr/commonNodeJS/master/OrbitControls/OrbitControlsGui.js';
//import OrbitControlsGui from 'https://raw.githack.com/anhr/commonNodeJS/master/OrbitControls/OrbitControlsGui.js';

//import loadScript from '../loadScriptNodeJS/loadScript.js';
//import { dat } from '../dat/dat.module.js';

//import controllerPlay from '../controllerPlay/controllerPlay.js';
//import controllerPlay from 'https://raw.githack.com/anhr/commonNodeJS/master/controllerPlay/controllerPlay.js';

//import GuiSelectPoint from '../guiSelectPoint/guiSelectPoint.js';
//import { GuiSelectPoint, getWorldPosition } from '../guiSelectPoint/guiSelectPoint.js';
//GuiSelectPoint.setTHREE( THREE );

//import { getWorldPosition } from '../getPosition.js';
//getPositionSetTHREE( THREE );

//import PositionController from '../PositionController.js';

//import { SpriteText } from '../SpriteText/SpriteText.js';
//SpriteText.setTHREE( THREE );

//import { SpriteTextGui } from '../SpriteText/SpriteTextGui.js';

//import ColorPicker from '../colorpicker/colorpicker.js';
//import ColorPicker from 'https://raw.githack.com/anhr/commonNodeJS/master/colorpicker/colorpicker.js';

//import MoveGroupGui from '../MoveGroupGui.js';

//import CameraGui from 'http://localhost/anhr/commonNodeJS/master/CameraGui.js';
//import CameraGui from '../CameraGui.js';
//import CameraGui from 'https://raw.githack.com/anhr/commonNodeJS/master/CameraGui.js';

//https://github.com/mrdoob/stats.js/
//import Stats from '../../../three.js/dev/examples/jsm/libs/stats.module.js';

//import FrustumPoints from '../frustumPoints/frustumPoints.js';
//import three from '../three.js'
/*
if ( typeof dat !== 'undefined' )
	three.dat =  dat;
*/
//import setOptions from '../setOptions.js'
//import FolderPoint from '../folderPoint.js'

/*проверка duplicate THREE
//import * as THREE2 from 'https://threejs.org/build/three.module.js';
import * as THREE2 from '../../../three.js/dev/build/three.module.js';
three.THREE = THREE2;
*/

//import Options from '../Options.js'

import pointLight from '../pointLight.js'

var debug = {

	opacity: 1 //непрозрачность frustumPoints

};

class MyThree {

	/**
	 * @description I use MyThree in my projects for displaying of my 3D objects in the canvas.
	 * @param {any} _THREE [THREE]{@link https://github.com/anhr/three.js|THREE}
	 * @param {createXDobjects} createXDobjects callback creates my 3D objects.
	 * @param {Options} [options] See <a href="../../jsdoc/Options/Options.html" target="_blank">Options</a>.
	 * The following options are available:
	 * @param {HTMLElement|string} [options.elContainer=document.getElementById( "containerDSE" ) or a div element, child of body] If an HTMLElement, then a HTMLElement, contains a canvas and HTMLElement with id="iframe-goes-in-here" for gui.
	 * <pre>
	 * If a string, then is id of the HTMLElement.
	 * </pre>
	 * @param {THREE.PerspectiveCamera} [options.camera] [PerspectiveCamera]{@link https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera}.
	 * @param {THREE.Vector3} [options.camera.position=new THREE.Vector3( 0.4, 0.4, 2 )] camera position.
	 * @param {THREE.Vector3} [options.camera.scale=new THREE.Vector3( 1, 1, 1 )] camera scale.
	 * @param {THREE.Scene} [options.scene] [Scene]{@link https://threejs.org/docs/index.html#api/en/scenes/Scene}.
	 * @param {THREE.Vector3} [options.scene.position=new THREE.Vector3( 0, 0, 0 )] scene position.
	 * @param {boolean} [options.orbitControls] false - do not add the [OrbitControls]{@link https://threejs.org/docs/index.html#examples/en/controls/OrbitControls}. Allow the camera to orbit around a target.
	 * @param {boolean} [options.axesHelper] false - do not add the <a href="../../AxesHelper/jsdoc/index.html" target="_blank">AxesHelper</a>.
	 * @param {boolean} [options.canvasMenu] false - do not create a <a href="../../canvasMenu/jsdoc/index.html" target="_blank">canvasMenu</a> instance.
	 * @param {boolean} [options.stereoEffect] false - do not use <a href="../../StereoEffect/jsdoc/index.html" target="_blank">StereoEffect</a>.
	 * @param {boolean} [options.pointLight] false - do not use <a href="../../jsdoc/pointLight/index.html" target="_blank">pointLight</a>.
	 * @param {object} [options.spriteText] spriteText options. See <a href="../../SpriteText/jsdoc/index.html" target="_blank">SpriteText</a> options for details. Default undefined.
	 *
	 * @param {boolean} [options.player] false - do not create a <a href="../../player/jsdoc/index.html" target="_blank">Player</a> instance.
	 * @param {object} [options.playerOptions] See <b>settings.options.playerOptions</b> of the <a href="../../player/jsdoc/module-Player-Player.html" target="_blank">Player</a>.
	 *
	 * @param {Function|string} [options.getLanguageCode=language code of your browser] Your custom <b>getLanguageCode()</b> function or language code string.
	 * <pre>
	 * returns the "primary language" subtag of the language version of the browser.
	 * Examples: "en" - English language, "ru" Russian.
	 * See the {@link https://tools.ietf.org/html/rfc4646#section-2.1|rfc4646 2.1 Syntax} for details.
	 * You can import { getLanguageCode } from '../../commonNodeJS/master/lang.js';
	 * Currently available follow language code strings:
	 *	"en" - English language,
	 *	"ru" - Russian.
	 * </pre>
	 * @param {object} [options.dat] use dat-gui JavaScript Controller Library. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {GUI} options.dat.dat [dat.GUI()]{@link https://github.com/dataarts/dat.gui}.
	 * @param {GUI} [options.dat.gui] new [dat.GUI()]{@link https://github.com/dataarts/dat.gui} instance.
	 * <p>
	 * undefined - do not use <b>dat-gui JavaScript Controller Library<b>. [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * </p>
	 * @param {boolean} [options.dat.cookie] false - do not save to cookie all user settings
	 * @param {string} [options.dat.cookieName] Name of the cookie.
	 * @param {boolean} [options.dat.orbitControlsGui] false - do not adds a <a href="../../OrbitControls/jsdoc/" target="_blank">OrbitControlsGui</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.axesHelperGui] false - do not adds a <a href="../../AxesHelper/jsdoc/module-AxesHelperGui.html" target="_blank">AxesHelperGui</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.playerGui] false - do not adds a <a href="../../player/jsdoc/module-Player-Player.html#gui" target="_blank">Player controllers</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.playController] false - do not adds a <a href="../../player/jsdoc/module-Player-Player_PlayController_PlayController.html" target="_blank">PlayController</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.stereoEffectsGui] false - do not adds <a href="../../StereoEffect/jsdoc/module-StereoEffect-StereoEffect.html#gui" target="_blank">Stereo Effects folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.guiSelectPoint] false - do not displays the <a href="../../guiSelectPoint/jsdoc/module-GuiSelectPoint.html" target="_blank">Select Point</a>. [dat.gui]{@link https://github.com/dataarts/dat.gui} based graphical user interface for select a point from the mesh.
	 * @param {boolean} [options.dat.guiFrustumPoints] false - do not adds <a href="../../FrustumPoints/jsdoc/FrustumPoints.html#gui" target="_blank">Frustum Points folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {boolean} [options.dat.cameraGui] false - do not adds <a href="../../jsdoc/CameraGui/module-CameraGui-CameraGui.html" target="_blank">Camera folder</a> into [dat.gui]{@link https://github.com/dataarts/dat.gui}.
	 * @param {object} [options.dat.moveScene] false - do not displays the <a href="../../jsdoc/MoveGroupGui/index.html" target="_blank">move group gui</a>.
	 * @param {object} [options.dat.spriteTextGui] false - do not displays the <a href="../../SpriteText/jsdoc/module-SpriteTextGui.html" target="_blank">SpriteTextGui</a>.
	 * @param {object} [options.dat.folderPoint] false - do not adds a <a href="../../jsdoc/folderPoint" target="_blank">Point settings</a> folder.
	 * @param {object} [options.dat.pointLightGui] false - do not adds a [PointLight]{@link https://threejs.org/docs/index.html?q=PointLight#api/en/lights/PointLight} folder.
	 * @param {object} [options.cameraTarget] camera looking at selected point during playing. See the <b>cameraTarget</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.cameraTarget.html#init" target="_blank">Player.cameraTarget.init(...)</a> function for details.
	 * @param {object} [options.frustumPoints] Creates a <a href="../../frustumPoints/jsdoc/index.html" target="_blank">FrustumPoints</a> instance.
	 * @param {MyThree.ColorPicker.palette|boolean|number} [options.palette=White color of all points] Points сolor.
	 * <pre>
	 * <b>MyThree.ColorPicker.palette</b> - is <b>new ColorPicker.palette( ... )</b>
	 * See <a href="../../colorpicker/jsdoc/index.html" target="_blank">ColorPicker</a> for details.
	 * <b>boolean</b>: true - <b>new ColorPicker.palette( { palette: ColorPicker.paletteIndexes.BGRW } )</b>;
	 * <b>number</b>: is <b>MyThree.ColorPicker.paletteIndexes</b>. See <a href="../../colorpicker/jsdoc/module-ColorPicker.html#~paletteIndexes" target="_blank">ColorPicker.paletteIndexes</a> for details.
	 * See <a href="../../jsdoc/Options/Options.html#setPalette" target="_blank">Options.setPalette</a>.
	 * </pre>
	 * @param {object} [options.canvas] <b>canvas</b> properties
	 * @param {number} [options.canvas.width] width of the canvas
	 * @param {number} [options.canvas.height] height of the canvas
	 * @param {boolean} [options.canvas.fullScreen] default is full screen. false - no full screen
	 * @param {number} [options.a=1] Can be use as 'a' parameter of the <b>Function</b>. See <b>options.a</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.execFunc.html" target="_blank">Player.execFunc</a>.
	 * @param {number} [options.b=0] Can be use as 'b' parameter of the <b>Function</b>. See <b>options.b</b> parameter of the <a href="../../player/jsdoc/module-Player-Player.execFunc.html" target="_blank">Player.execFunc</a>.
	 * @param {object} [options.point] point settings. Applies to points with ShaderMaterial.
	 * <pre>
	 * See [ShaderMaterial]{@link https://threejs.org/docs/index.html#api/en/materials/ShaderMaterial} for details.
	 * The size of the point seems constant and does not depend on the distance to the camera.
	 * </pre>
	 * See <a href="../../jsdoc/Options/Options.html#setPoint" target="_blank">Options.setPoint(options)</a> for details.
	 * @param {object} [options.stats] Use JavaScript Performance Monitor. [stats]{@link https://github.com/mrdoob/stats.js/} .
	 * @param {object} [options.scales] axes scales.
	 * See <b>options.scales</b> of the <a href="../../AxesHelper/jsdoc/module-AxesHelper-AxesHelper.html" target="_blank">AxesHelper</a>.
	 *
	 * @param {object} [options.scales.w] <b>w</b> axis options. See <a href="../../jsdoc/Options/Options.html#setW" target="_blank">Options.setW(options)</a> <b>options.scales.w</b> for details.
	 *
	 * @todo If you want to use raycaster (working out what objects in the 3d space the mouse is over) [Raycaster]{@link https://threejs.org/docs/index.html#api/en/core/Raycaster},
	 * <pre>
	 * please add following object into your 3D Object userdata:
	 * your3dObject.userData.raycaster = {

			onIntersection: function ( raycaster, intersection, scene, INTERSECTED ) {

				//Mouse is over of your 3D object event
				//TO DO something
				//For example you can use
				options.raycaster.onIntersection( intersection, scene );
				//for displaying of the position of your 3D object
				//ATTENTION!!! Use onIntersection and onIntersectionOut togethe!

			},
			onIntersectionOut: function ( scene, INTERSECTED ) {

				//Mouse is out of your 3D object event
				//TO DO something
				//For example you can use
				options.raycaster.onIntersectionOut( scene );
				//for hide of the position of your 3D object that was displayed in onIntersection
				//ATTENTION!!! Use onIntersection and onIntersectionOut togethe!

			},
			onMouseDown: function ( raycaster, intersection, scene ) {

				//User has clicked over your 3D object
				//TO DO something
				//For example:
				var position = raycaster.stereo.getPosition( intersection );
				alert( 'You are clicked the "' + intersection.object.type + '" type object.'
					+ ( intersection.index === undefined ? '' : ' Index = ' + intersection.index + '.' )
					+ ' Position( x: ' + position.x + ', y: ' + position.y + ', z: ' + position.z + ' )' );

			},

		}
	 * </pre>
	 * <a href="../Examples/html/" target="_blank">Example</a>.
	 */
	constructor( createXDobjects, options ) {


	}

}
export default MyThree;
