import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super( ...arguments );
  },

  didInsertElement() {
    this._super( ...arguments );

    this.set( 'scene', new xeogl.Scene( {
      canvas: 'VisualizerCanvas' } )
    );

    xeogl.setDefaultScene( this.scene );

    this.set( 'camera', this.scene.camera );
    this.camera.look = [ 0, 50, 0 ];
    this.camera.eye = [ 1000, 1000, 1000 ];

    this.set( 'lights', { 
      ambientLight: new xeogl.AmbientLight( {
        color: [ 0.8, 0.3, 0.1 ],
        intensity: 0.9 } ),
      dirLightA: new xeogl.DirLight( {
        dir: [ -0.4, -1.0, -0.4 ],
        color: [ 1.0, 1.0, 1.0 ],
        intensity: 1.0,
        space: 'world' } ),
      dirLightB: new xeogl.DirLight( {
        dir: [ 0.4, -0.5, 0.4 ],
        color: [ 1.0, 1.0, 1.0 ],
        intensity: 0.3,
        space: 'world' } )
    } );

    this.set( 'objects', {
      city: new xeogl.OBJModel( {
        id: 'city',
        src: '/obj-models/city.obj',
        pos: [ 0, 0, 0 ],
        scale: [ 1, 1, 1 ] 
      } ),
      
      ground: new xeogl.Mesh( {
        position: [ 0, 0, 0 ],
        geometry: new xeogl.PlaneGeometry( {
          xSize: 5000,
          zSize: 5000 } ),
        material: new xeogl.PhongMaterial( {
          ambient: [ 0.0, 0.0, 0.0 ],
          diffuse: [ 0.3, 0.0, 0.8 ],
          specular: [ 0.0, 0.0, 0.0 ],
          glossiness: 0,
          alpha: 0.2,
          alphaMap: {
            type: 'xeogl.Texture',
            src: '/maps/radial.jpg' },
          alphaMode: 'blend' } ),
        collidable: false,
        pickable: false
      } )
    } );

    this.set( 'cameraControl', new xeogl.CameraControl() );

    this.scene.on( 'tick', this.animate( 'orbit' ) );
  },
  
  animate: function( animator ) { 
    var animators = {
      orbit: function() {
        this.camera.orbitYaw( -0.2 );
      }
    }; 

    return animators[animator];
  }
});
