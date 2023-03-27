import { useEffect, useState } from 'react';
import axios from 'axios';
import { Feature, Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Point } from 'ol/geom';

import { apiUrl } from '../appConfig';

import 'ol/ol.css';

const Maps = () => {
  const [sightings, setSightings] = useState([]);

  useEffect(() => {
    const fetchSightings = async () => {
      const response = await axios.get(apiUrl + '/sightings');
      setSightings(response.data);
    };

    fetchSightings();
  }, []);

  useEffect(() => {
    const map = new Map({
      target: 'map-container',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([10.120000000, 45.670000000]),
        zoom: 5,
      }),
    });

    const vectorSource = new Vector({
      features: sightings.map((sighting) => {
        const feature = new Feature({
          geometry: new Point(
            fromLonLat([parseFloat(sighting.longitude), parseFloat(sighting.latitude)])
          ),
        });

        feature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: 'red' }),
              stroke: new Stroke({ color: 'black', width: 2 }),
            }),
          })
        );

        return feature;
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    return () => {
      map.setTarget(undefined);
    };
  }, [sightings]);

  return <div id="map-container" style={{ height: `calc(100vh - 64px - 24px)` }}></div>;
};

export default Maps;
