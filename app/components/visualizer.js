import Component from '@ember/component';

export default Component.extend({

  init() {
    this._super( ...arguments );

    this.set( 'cam_pos', {
      index: {
        look: [ 0, 200, 0 ],
        eye: [ 300, 100, -300 ],
        up: [ 0, 1, 0 ],
        duration: [ 0.5 ]
        },
      about: {
        look: [ 0, 200, 0 ],
        eye: [ 1500, 2000, -1000 ],
        up: [ 0, 1, 0 ],
        duration: [ 0.5 ]
        },
      features: {
        look: [ 0, 200, 0 ],
        eye: [ 500, 500, -500 ],
        up: [ 0, 1, 0 ],
        duration: [ 0.5 ]
        },
     } ); 
  },

  didInsertElement() {
    let route = this.route != 'undefined' ? this.route : 'index';

    this.set( 'scene', new xeogl.Scene( {
      canvas: 'VisualizerCanvas' } )
    );

    xeogl.setDefaultScene( this.scene );

    this.set( 'camera', this.scene.camera );
    this.set( 'cameraControl', new xeogl.CameraControl() );
    this.set( 'cameraFlight', new xeogl.CameraFlightAnimation( {
        fit: true,
        fitFOV: 45,
        duration: 0.5
      }, function() {} ) );

    this.scene.clearLights();
    
    this.set( 'lights', { 
      ambientLight: new xeogl.AmbientLight( {
        color: [ 0.95, 0.95, 1.0 ],
        intensity: 1.0 } ),
      dirLightA: new xeogl.DirLight( {
        dir: [ 0.4, -1.0, -0.4 ],
        color: [ 1.0, 0.9, 0.8 ],
        intensity: 1.9,
        space: 'world' } ),
      dirLightB: new xeogl.DirLight( {
        dir: [ -0.4, -0.8, 0.4 ],
        color: [ 1.0, 1.0, 1.0 ],
        intensity: 2.0,
        space: 'world' } )
    } );

    this.set( 'objs', {

      building: new xeogl.OBJModel( {
        id: 'building',
        src: 'obj-models/apartment_building_1.obj',
        pos: [ 0, 0, 0 ],
        scale: [ 0.5, 0.5, 0.5 ]
      } ),

      city: new xeogl.OBJModel( {
        id: 'city',
        src: 'obj-models/city.obj',
        pos: [ 0, 0, 0 ],
        scale: [ 0.5, 0.5, 0.5 ],
        pickable: false
      } ),
      
      /* ground: new xeogl.Mesh( {
        id: 'ground',
        position: [ 0, -1, 0 ],
        geometry: new xeogl.PlaneGeometry( {
          xSize: 1000,
          zSize: 1000 } ),
        material: new xeogl.PhongMaterial( {
          ambient: [ 0.0, 0.5, 0.0 ],
          diffuse: [ 0.0, 0.5, 0.0 ],
          specular: [ 0.0, 0.0, 0.0 ],
          glossiness: 0,
          alpha: 0.2,
          alphaMap: {
            type: 'xeogl.Texture',
            src: 'maps/radial2.jpg' },
          alphaMode: 'blend' } ),
        collidable: false,
        pickable: false
      } ) */
    } );

    this.objs.city.on( 'loaded', function() {
      for(var m in this.meshes) {
        let mesh = this.meshes[m];
        mesh.pickable = false;
        mesh.opacity = 0.8;
      }
    } );

    this.objs.building.on( 'loaded', function() { } );

    this.camera.look = [ 0, 200, 0 ];
    this.camera.eye = [ 1000, 600, -1000 ];
    this.cameraFlight.flyTo(this.cam_pos[route]);
    
    this.set( 'animator', 'orbit' );

    this.scene.on( 'tick', this.animate() );

    this._super( ...arguments );
  },
  
  animate: function() {
    let animator = this.animator ? this.animator : 'default';
    
    var animators = {
      orbit: function() {
        this.camera.orbitYaw( -0.2 );
      },

      default: function() { }
    }; 

    return animators[ animator ];
  },

  actions: {
    flyOut() {
      let cameraFlight = new xeogl.CameraFlightAnimation( {
        fit: true,
        fitFOV: 45,
        duration: 0.5
      }, function() {} );
      
      cameraFlight.flyTo( this.objs.city );
    },

    flyIn() {
      let cameraFlight = new xeogl.CameraFlightAnimation( {
        fit: true,
        fitFOV: 45,
        duration: 0.5
      }, function() {} );

      cameraFlight.flyTo( this.objs.building );
    }
  },

  didUpdateAttrs() {
    let route = this.route != 'undefined' ? this.route : 'index';

    let cameraFlight = new xeogl.CameraFlightAnimation( {
        fit: true,
        fitFOV: 45,
        duration: 0.5
      }, function() { } );

    cameraFlight.flyTo( this.cam_pos[route] );
  }

});
