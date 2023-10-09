export function rayCaster(camera, event) {
    
    // Get the mouse position in normalized device coordinates
    const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
    };

    // Create a raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    console.log(raycaster)
    // updateCameraPosition();
    // Check for intersections with clickable objects
    const intersects = raycaster.intersectObjects(clickableObjects.current);

    if (intersects.length > 0) {
        // Handle the click event for the intersected object(s)
        const clickedObject = intersects[0].object;
        console.log('Clicked:', clickedObject);

        // Example: You can trigger an action or state change based on the click
        // For instance, change the color of the clicked object
        //  clickedObject.material.color.set(0xff0000); // Set color to red
    }
}