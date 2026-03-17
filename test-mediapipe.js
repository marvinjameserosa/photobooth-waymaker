
try {
    const mpFaceMesh = require('@mediapipe/face_mesh');
    console.log('Keys:', Object.keys(mpFaceMesh));
    console.log('FaceMesh exists:', !!mpFaceMesh.FaceMesh);
    console.log('FaceMesh type:', typeof mpFaceMesh.FaceMesh);
} catch (e) {
    console.error(e);
}
