'use client';

import { useEffect, useRef, useState } from 'react';

export default function Map3D() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState<any | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const addControls = (map: any) => {
    // Add your custom controls here
    const controlsContainer = document.createElement('div');
    controlsContainer.className =
      'absolute top-4 right-4 z-10 flex flex-col gap-2';

    // Zoom in button
    const zoomInButton = document.createElement('button');
    zoomInButton.className =
      'bg-white p-2 rounded-full shadow-md hover:bg-gray-100';
    zoomInButton.innerHTML = '+';
    zoomInButton.onclick = () => {
      map.range = Math.max(100, map.range * 0.8);
    };

    // Zoom out button
    const zoomOutButton = document.createElement('button');
    zoomOutButton.className =
      'bg-white p-2 rounded-full shadow-md hover:bg-gray-100';
    zoomOutButton.innerHTML = '-';
    zoomOutButton.onclick = () => {
      map.range = Math.min(10000, map.range * 1.2);
    };

    // Tilt control
    const tiltButton = document.createElement('button');
    tiltButton.className =
      'bg-white p-2 rounded-full shadow-md hover:bg-gray-100';
    tiltButton.innerHTML = '↕️';
    tiltButton.onclick = () => {
      map.tilt = map.tilt === 0 ? 64 : 0;
    };

    controlsContainer.appendChild(zoomInButton);
    controlsContainer.appendChild(zoomOutButton);
    controlsContainer.appendChild(tiltButton);

    document.getElementById('map-container')?.appendChild(controlsContainer);
  };

  //   const initMap = async () => {
  //     try {
  //       // @ts-ignore
  //       const { Map3DElement } = await google.maps.importLibrary('maps3d');
  //       // @ts-ignore
  //       const { Autocomplete } = await google.maps.importLibrary('places');

  //       // Create the map
  //       const map3DElement = new Map3DElement({
  //         center: { lat: 8.6753, lng: 9.082, altitude: 30 },
  //         range: 1400,
  //         tilt: 64,
  //         heading: -5,
  //         mode: 'HYBRID',
  //       });

  //       mapInstanceRef.current = map3DElement;

  //       const mapContainer = document.getElementById('map-container');
  //       if (mapContainer) {
  //         mapContainer.innerHTML = ''; // Clear any existing content
  //         mapContainer.appendChild(map3DElement);
  //         addControls(map3DElement);
  //         setMapLoaded(true);
  //       }

  //       // Initialize Autocomplete
  //       if (searchInputRef.current) {
  //         const autocompleteInstance = new Autocomplete(searchInputRef.current, {
  //           types: ['geocode'],
  //           fields: ['geometry', 'name'],
  //         });

  //         autocompleteInstance.addListener('place_changed', () => {
  //           const place = autocompleteInstance.getPlace();
  //           if (place.geometry?.location) {
  //             const lat = place.geometry.location.lat();
  //             const lng = place.geometry.location.lng();

  //             // Zoom to selected location
  //             map3DElement.center = {
  //               lat,
  //               lng,
  //               altitude: 30,
  //             };
  //             map3DElement.range = 500; // Zoom in closer
  //           }
  //         });

  //         setAutocomplete(autocompleteInstance);
  //       }

  //       map3DElement.addEventListener('gmp-click', async (event: any) => {
  //         event.preventDefault();
  //         if (event.placeId) {
  //           const place = await event.fetchPlace();
  //           await place.fetchFields({ fields: ['*'] });

  //           document.getElementById('placeName')!.innerHTML =
  //             '<b>Name :</b><br>&nbsp;' + place.displayName;
  //           document.getElementById('placeId')!.innerHTML =
  //             '<b>Id :</b><br>&nbsp;' + place.id;
  //           document.getElementById('placeType')!.innerHTML = '<b>Types :</b>';

  //           for (const type of place.types) {
  //             document.getElementById('placeType')!.innerHTML +=
  //               '<br>&nbsp;' + type;
  //           }

  //           document.getElementById('details')!.style.display = 'block';
  //         }
  //       });
  //     } catch (error) {
  //       console.error('Error initializing map:', error);
  //     }
  //   };

  //   const initMap = async () => {
  //     try {
  //       // Load libraries
  //       // @ts-ignore
  //       const { Map3DElement } = await google.maps.importLibrary('maps3d');
  //       // @ts-ignore
  //       const { Autocomplete } = await google.maps.importLibrary('places');

  //       // Create map
  //       const map3DElement = new Map3DElement({
  //         center: { lat: 8.6753, lng: 9.082, altitude: 30 },
  //         range: 1400,
  //         tilt: 64,
  //         heading: -5,
  //         mode: 'HYBRID',
  //       });

  //       mapInstanceRef.current = map3DElement;

  //       const mapContainer = document.getElementById('map-container');
  //       if (mapContainer) {
  //         mapContainer.innerHTML = '';
  //         mapContainer.appendChild(map3DElement);
  //         addControls(map3DElement);
  //         setMapLoaded(true);
  //       }

  //       // Autocomplete setup
  //       if (searchInputRef.current) {
  //         const autocompleteInstance = new Autocomplete(searchInputRef.current, {
  //           types: ['geocode'],
  //           fields: ['geometry', 'name'],
  //         });

  //         autocompleteInstance.addListener('place_changed', () => {
  //           const place = autocompleteInstance.getPlace();
  //           if (place.geometry?.location) {
  //             const lat = place.geometry.location.lat();
  //             const lng = place.geometry.location.lng();
  //             map3DElement.center = { lat, lng, altitude: 30 };
  //             map3DElement.range = 500;
  //           }
  //         });
  //       }

  //       // Place click event
  //       map3DElement.addEventListener('gmp-click', async (event: any) => {
  //         event.preventDefault();
  //         if (event.placeId) {
  //           const place = await event.fetchPlace();
  //           await place.fetchFields({ fields: ['*'] });
  //           document.getElementById(
  //             'placeName'
  //           )!.innerHTML = `<b>Name :</b><br>&nbsp;${place.displayName}`;
  //           document.getElementById(
  //             'placeId'
  //           )!.innerHTML = `<b>Id :</b><br>&nbsp;${place.id}`;
  //           document.getElementById(
  //             'placeType'
  //           )!.innerHTML = `<b>Types :</b>${place.types
  //             .map((t: string) => `<br>&nbsp;${t}`)
  //             .join('')}`;
  //           document.getElementById('details')!.style.display = 'block';
  //         }
  //       });
  //     } catch (error) {
  //       console.error('Error initializing map:', error);
  //     }
  //   };

  //   useEffect(() => {
  //     // Check if Google Maps API is already loaded
  //     //@ts-ignore
  //     if (window.google?.maps) {
  //       initMap();
  //       return;
  //     }

  //     let script: HTMLScriptElement | null = null;

  //     // Load Google Maps JS API dynamically if not already loaded
  //     if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
  //       script = document.createElement('script');
  //       script.id = 'google-maps-script';
  //       script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=beta&libraries=maps3d,places`;
  //       script.async = true;
  //       script.defer = true;

  //       script.onload = () => initMap();
  //       document.head.appendChild(script);
  //     }

  //     // Initialize map when API is ready
  //     //@ts-ignore
  //     // window.initMap = initMap;

  //     return () => {
  //       // Clean up
  //       if (script) {
  //         document.head.removeChild(script);
  //       }
  //       //@ts-ignore
  //       //   window.initMap = undefined;
  //     };
  //   }, []);

  // useEffect(() => {

  //   // Load Google Maps JS API dynamically
  //   const script = document.createElement('script');
  //   script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=beta&libraries=maps3d`;
  //   script.async = true;
  //   script.onload = () => {
  //     initMap();
  //   };
  //   document.head.appendChild(script);

  //   };

  //   return () => {
  //     // Clean up script if component unmounts
  //     document.head.removeChild(script);
  //   };
  // }, []);

  useEffect(() => {
    const initMap = async () => {
      try {
        // @ts-ignore
        const { Map3DElement } = await google.maps.importLibrary('maps3d');
        //@ts-ignore
        const { Autocomplete } = await google.maps.importLibrary('places');

        // Create the map
        const map3DElement = new Map3DElement({
          center: { lat: 8.6753, lng: 9.082, altitude: 30 },
          range: 1400,
          tilt: 64,
          heading: -5,
          mode: 'HYBRID',
        });

        mapInstanceRef.current = map3DElement;

        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
          mapContainer.innerHTML = '';
          mapContainer.appendChild(map3DElement);
          addControls(map3DElement);
          setMapLoaded(true);
        }

        // Initialize Autocomplete
        if (searchInputRef.current) {
          const autocompleteInstance = new Autocomplete(
            searchInputRef.current,
            {
              types: ['geocode'],
              fields: ['geometry', 'name'],
            }
          );

          autocompleteInstance.addListener('place_changed', () => {
            const place = autocompleteInstance.getPlace();
            if (place.geometry?.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();

              // Zoom to selected location
              map3DElement.center = {
                lat,
                lng,
                altitude: 30,
              };
              map3DElement.range = 500; // Zoom in closer
            }
          });

          setAutocomplete(autocompleteInstance);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    //@ts-ignore
    if (window.google?.maps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=beta&libraries=maps3d,places`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';

    script.onload = () => {
      initMap();
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className='absolute inset-0 flex flex-col'>
      {/* Search Bar */}
      {/* {mapLoaded && ( */}
      <div className='absolute top-4 left-4 z-10 w-64 bg-white rounded-lg shadow-md'>
        {/* <div className='relative'> */}
        <input
          ref={searchInputRef}
          type='text'
          placeholder='Search for a location...'
          className='w-full p-2 rounded-lg focus:outline-none'
        />
        {/* </div> */}
      </div>
      {/* )} */}
      {!mapLoaded && (
        <div className='absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center'>
          <span className='text-gray-500'>Loading map...</span>
        </div>
      )}
      {/* Map container - takes all available space */}
      <div id='map-container' className='flex-1 w-full h-full'></div>

      {/* Details panel - positioned absolutely within the map */}
      <div className='absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10'>
        <div id='details' className='hidden'>
          <div id='placeName'></div>
          <div id='placeId'></div>
          <div id='placeType'></div>
        </div>
        <div className='textContainer'>
          <div className='text'>Click on a place to get details.</div>
        </div>
      </div>
    </div>
  );
}
