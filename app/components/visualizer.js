import Component from '@ember/component';

export default Component.extend({
  classNameBindings: ['displayAnnotations'],
  displayAnnotations: true,

  actions: {
    flyOut() {
      this.cameraFlight.flyTo( this.objs.city );
    },
    flyIn() {
      this.cameraFlight.flyTo( this.objs.building );
    },
    showAnnotations() {
      for (let a in this.annotations) {
        this.annotations[a].pinShown = true;
        this.annotations[a].labelShown = true;
      }
    },
    hideAnnotations() {
      for (let a in this.annotations) {
        this.annotations[a].pinShown = false;
        this.annotations[a].labelShown = false;
      }
    }
  },

  init() {
    this.set( 'cam_pos', {
      index: {
        look: [ 0, 200, 0 ],
        eye: [ 300, 100, -300 ],
        up: [ 0, 1, 0 ],
        duration: [ 0.5 ]
        },
      about: {
        look: [ 0, 200, 0 ],
        eye: [ 1200, 1200, -1200 ],
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
     
    this._super( ...arguments );
  },

  didInsertElement() {
    let route = this.route != 'undefined' ? this.route : 'index';

    this.set( 'scene', new xeogl.Scene( { canvas: 'VisualizerCanvas' } ) );

    xeogl.setDefaultScene( this.scene );

    this.set( 'camera', this.scene.camera );
    this.set( 'cameraControl', new xeogl.CameraControl() );
    this.set( 'cameraFlight', new xeogl.CameraFlightAnimation( {
      fit: true,
      fitFOV: 45,
      duration: 0.5
    }, function () { } ) );

    this.scene.clearLights();
    
    this.set( 'lights', { 
      ambientLight: new xeogl.AmbientLight( {
        color: [ 0.95, 0.95, 1.0 ],
        intensity: 1.0 } ),

      dirLightA: new xeogl.DirLight( {
        dir: [ 0.4, -1.0, -0.4 ],
        color: [ 1.0, 1.0, 1.0 ],
        intensity: 1.9,
        space: 'world' } ),
        
      dirLightB: new xeogl.DirLight( {
        dir: [ -0.4, -0.8, 0.4 ],
        color: [ 1.0, 1.0, 1.0 ],
        intensity: 1.5,
        space: 'world' } )

    } );
 
    this.set( 'objs', {
      building: new xeogl.OBJModel( {
        id: 'building',
        src: 'obj-models/apartment_building_1.obj',
        position: [ 0, 0, 0 ],
        scale: [ 0.5, 0.5, 0.5 ]
      } ),

      city: new xeogl.OBJModel( {
        id: 'city',
        src: 'obj-models/city.obj',
        position: [ 0, 100, 0 ],
        scale: [ 0.6, 0.6, 0.6 ]
      } ),
    } );

    this.objs.building.on( 'loaded', function() {
      for(var m in this.objs.building.meshes) {
        let mesh = this.objs.building.meshes[m];
        mesh.pickable = true;
      }

      this.set( 'annotations', {
        balcony: new xeogl.Annotation( {
          mesh: this.objs.building.meshes['building#balcony'],
          primIndex: 1385,
          bary: [ 0.3, 0.3, 0.3 ],
          glyph: 'A',
          title: 'Balcony',
          desc: 'Provides access to outdoor space.',
          pinShown: route == 'features',
          labelShown: route == 'features',
        } ),

        window: new xeogl.Annotation( {
          mesh: this.objs.building.meshes['building#windows'],
          primIndex: 5446,
          bary: [ 0.3, 0.3, 0.3 ],
          glyph: 'B',
          title: 'Window',
          desc: 'Provides view to outdoor world.',
          pinShown: route == 'features',
          labelShown: route == 'features',
        } )
      } );
    }.bind(this) );

    this.objs.city.on( 'loaded', function() {
      for(var m in this.objs.city.meshes) {
        let mesh = this.objs.city.meshes[m];
        mesh.pickable = false;
        mesh.ghosted = true;
        mesh.ghostMaterial.edges = true;
        mesh.ghostMaterial.edgeColor = [ 1, 1, 1 ];
        mesh.ghostMaterial.edgeAlpha = 0.2;
        mesh.ghostMaterial.edgeWidth = 1.0;
        mesh.ghostMaterial.fill = true;
        mesh.ghostMaterial.fillColor = [0, 0, 0];
        mesh.ghostMaterial.fillAlpha = 0.1;
      }
    }.bind(this) );

    this.camera.look = [ 0, 200, 0 ];
    this.camera.eye = [ 1000, 600, -1000 ];
    this.cameraFlight.flyTo( this.cam_pos[route] );
    
    this.set( 'animator', this.getAnimator( this.scene ) );
    
    this.animator.setAnimation( route == 'features' ? 'default' : 'orbit' );

    this.scene.on( 'tick', this.animator.animator );

    this._super( ...arguments );
  },
  
  getAnimator: function( scene ) {
    return new function() {
      var animation = 'default';
      
      var animators = {
        orbit: function () {
          scene.camera.orbitYaw(-0.2);
        },

        default: function () { }
      };

      var animator = function () { animators[ animation ](); };

      this.animator = function() { animator() };

      this.setAnimation = function( animate = 'default' ) { animation = animate; }
    };
  },

  didUpdateAttrs() {
    let route = this.route != 'undefined' ? this.route : 'index';
    
    this.cameraFlight.flyTo( this.cam_pos[route] );

    if (route == 'features') {
      this.animator.setAnimation('default');
      this.set( 'displayAnnotations', true);
      this.send('showAnnotations');
    } else {
      this.animator.setAnimation('orbit');
      this.set( 'displayAnnotations', false);
      this.send('hideAnnotations');
    }
  }
});
