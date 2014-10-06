/**
 * Panoramic image.
 */
function threeSixty( vars ) {

  /**
   * Check if webGL is supported.
   * @returns {*}
   */
  var isWebgl = function () {
    try {
      var canvas = document.createElement( 'canvas' );
      return !!window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
    }
    catch ( e ) {
      return false;
    }
  };

  /**
   * Check if it's a mobile device.
   * @returns {boolean}
   */
  var isMobile = function () {
    var a = navigator.userAgent || navigator.vendor || window.opera;
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test( a ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( a.substr( 0, 4 ) ) ? true : false;
  };

  if ( !isWebgl() ) {
    return false;
  }

  if ( vars.mobile !== true && isMobile() ) {
    return false;
  }
  var
      camera,
      scene,
      renderer,
      isDrag = false,
      isPause = false,
      isPlanet = false,
//      isFull = false,
      lon = 0,
      lat = 0,
      phi = 0,
      theta = 0,
      onPointerDownPointerX = 0,
      onPointerDownPointerY = 0,
      onPointerDownLon = 0,
      onPointerDownLat = 0;

  var container = document.getElementById( vars.containerID );
  container.innerHTML = '<div id="pano-wrapper"></div>';
  var wrapper = document.getElementById( 'pano-wrapper' );

  /**
   * Initialize.
   */
  function init() {
    var mesh;

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
    camera.target = new THREE.Vector3( 0, 0, 0 );

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry( 500, 80, 60 );
    geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

    THREE.ImageUtils.crossOrigin = "";

    var material = new THREE.MeshBasicMaterial();
    if ( vars.image ) {
      // Image path.
      material.map = THREE.ImageUtils.loadTexture( vars.image );
    }
    else if ( vars.canvas ) {
      material.map = new THREE.Texture( vars.canvas );
      material.map.needsUpdate = true;
    }

    mesh = new THREE.Mesh( geometry, material );

    scene.add( mesh );
//      renderer = isWebgl() ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    wrapper.appendChild( renderer.domElement );

    /**
     * Mouse down event.
     */
    container.addEventListener( 'mousedown', function ( event ) {
      event.preventDefault();

      if ( event.target.id == 'pano-control' || event.target.parentNode.id == 'pano-control' ) {
        event.stopPropagation();
        return;
      }

      isPause = true;
      isDrag = true;

      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;

      onPointerDownLon = lon;
      onPointerDownLat = lat;
    } );

    /**
     * Mouse up event.
     */
    container.addEventListener( 'mouseup', function () {
      if ( event.target.id == 'pano-control' || event.target.parentNode.id == 'pano-control' ) {
        event.stopPropagation();
        return;
      }
      isPause = false;
      isDrag = false;
    } );

    /**
     * Mouse move event.
     */
    container.addEventListener( 'mousemove', function ( event ) {
      if ( !isDrag ) {
        return;
      }
      lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
      lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
    } );

    /**
     * Mouse wheel event.
     */
    container.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
    container.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false );
    function onDocumentMouseWheel( event ) {
      // WebKit
      if ( event.wheelDeltaY ) {
        camera.fov -= event.wheelDeltaY * 0.05;
      }
      // Opera / Explorer 9
      else if ( event.wheelDelta ) {
        camera.fov -= event.wheelDelta * 0.05;
      }
      // Firefox
      else if ( event.detail ) {
        camera.fov += event.detail * 1.0;
      }
      camera.fov = Math.max( 40, Math.min( 100, camera.fov ) );
      camera.updateProjectionMatrix();
    }

//      window.resize(function() {
//        camera.aspect = window.innerWidth / window.innerHeight;
//        camera.updateProjectionMatrix();
//
//        renderer.setSize( window.innerWidth, window.innerHeight );
//      });
  }

  /**
   * Controls.
   */
  if ( typeof vars.controls !== 'undefined' ) {

    wrapper.innerHTML += '<div id="pano-control"></div>';
    var controls = document.getElementById( 'pano-control' );

    if ( typeof vars.controls.pause !== 'undefined' && vars.controls.pause === true ) {
      /**
       * Pause event.
       */
      controls.innerHTML += '<a href="javascript:void(0)" id="pano-pause">Pause</a>';
      document.addEventListener( 'click', function ( e ) {
        if ( e.target.id == 'pano-pause' ) {
          isPause = isPause == true ? false : true;
          if ( isPause == true ) {
            e.target.classList.add( 'active' );
          }
          else {
            e.target.classList.remove( 'active' );
          }
        }

      } );
    }

    if ( typeof vars.controls.littlePlanet !== 'undefined' && vars.controls.littlePlanet === true ) {
      /**
       * Little-planet event.
       */
      controls.innerHTML += '<a href="javascript:void(0)" id="pano-planet">Little Planet</a>';
      document.addEventListener( 'click', function ( e ) {
        if ( e.target.id == 'pano-planet' ) {
          isPlanet = isPlanet == true ? false : true;
          if ( isPlanet == true ) {
            e.target.classList.add( 'active' );
          }
          else {
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 0;
            lat = 0;
            camera.fov = 75;
            camera.updateProjectionMatrix();
            e.target.classList.remove( 'active' );
          }
        }

      } );
    }

//    if ( typeof vars.controls.fullWidth !== 'undefined' && vars.controls.fullWidth === true ) {
//      /**
//       * Full-width event.
//       */
//      controls.innerHTML += '<a href="javascript:void(0)" id="pano-full">Full Width</a>';
//      document.addEventListener( 'click', function ( e ) {
//        if ( e.target.id == 'pano-full' ) {
//          isFull = isFull == true ? false : true;
//          if ( isFull == true ) {
//            container.classList.add( 'full-width' );
//            e.target.classList.add( 'active' );
//          }
//          else {
//            container.classList.remove( 'full-width' );
//            e.target.classList.remove( 'active' );
//          }
//        }
//
//      } );
//    }
  }

  /**
   * Animate.
   */
  function animate() {
    requestAnimationFrame( animate, window );
    update();
  }

  /**
   * Update.
   */
  function update() {
    if ( isPause === false ) {
      lon += 0.1;
    }

    lat = Math.max( -85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );

    camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
    camera.target.y = 500 * Math.cos( phi );
    camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt( camera.target );

    /**
     * Little planet mode.
     */
    if ( isPlanet == true ) {
      // distortion
      camera.position.copy( camera.target ).negate();
      lat -= 90;
      camera.fov = 140;
      camera.updateProjectionMatrix();
    }

    renderer.render( scene, camera );
  }

  init();
  animate();
};
