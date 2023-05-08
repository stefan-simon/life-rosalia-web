import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

import { Feature, Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector } from 'ol/source';
import ClusterSource from 'ol/source/Cluster';
import { fromLonLat } from 'ol/proj';
import { containsXY } from 'ol/extent';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { Point } from 'ol/geom';
import { fromExtent } from "ol/geom/Polygon";

import { Button, Checkbox, Drawer } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';

import 'ol/ol.css';
import SightingDetails from '../Components/SightingDetails';
import SightingsList from '../Components/SightingsList';
import { getSpeciesColor } from '../utils';

const Maps = () => {
  const { state } = useLocation();
  const filteredSightings = state?.filteredSightings;
  const [map, setMap] = useState(null);

  const [viewPortExtent, setViewPortExtent] = useState(null);
  const [sightingsInViewport, setSightingsInViewport] = useState([]);
  const [showFeaturesDrawer, setShowFeaturesDrawer] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);


  const [useCluster, setUseCluster] = useState(false);

  const clusterStyle = (feature) => {
    const size = feature.get('features').length;
    let style = new Style({
      image: new CircleStyle({
        radius: 15,
        stroke: new Stroke({
          width: 3,
          color: '#6dc9ee',
        }),
        fill: new Fill({
          color: '#3399CC',
        }),
      }),
      text: new Text({
        font: 'bold 14px Arial',
        text: size.toString(),
        fill: new Fill({
          color: '#fff',
        }),
      }),
    });
    return style;
  }

  const sightingStyle = (feature) => {
    const species = feature.get('properties')?.sighting?.species || 'unknown';
    const isVerified = feature.get('properties')?.sighting?.verified || false;

    let color = getSpeciesColor(species)

    const style = new Style({
      image: new CircleStyle({
        radius: 9,
        fill: new Fill({
          color: color,
        }),
        stroke: new Stroke({
          color: isVerified ? '#ffffff' : '#ffd000',
          width: 3,
        }),
      }),
    });
    return style;
  }

  // retrieves the users from the API
  useEffect(() => {
    const map = new Map({
      target: 'map-container',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-75.120000000, 45.670000000]),
        zoom: 5,
      }),
    });

    setMap(map);
    map.on('moveend', () => {
      // if there are no sightings, return
      const extent = map.getView().calculateExtent(map.getSize());
      setViewPortExtent(extent);
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // when the sightings or the viewport extent changes, update the list of sightings in the viewport
  useEffect(() => {
    if (!viewPortExtent || !filteredSightings) return;
    const sightingsInExtent = filteredSightings.filter((sighting) => {
      const coords = fromLonLat([parseFloat(sighting.longitude), parseFloat(sighting.latitude)]);
      return containsXY(viewPortExtent, coords[0], coords[1]);
    });
    setSightingsInViewport(sightingsInExtent);
  }, [viewPortExtent, filteredSightings]);

  useEffect(() => {
    if (!map || !filteredSightings) return;

    let vectorSource;

    const featuresSource = new Vector({
      features: filteredSightings.map((sighting) => {
        const feature = new Feature({
          geometry: new Point(
            fromLonLat([parseFloat(sighting.longitude), parseFloat(sighting.latitude)])
          ),
          properties: { sighting }, // Attach the sighting data to the feature as a property
        });

        feature.setId(sighting.id);
        return feature;
      }),
    });

    // zoom to the extent of the vector layer features
    const extent = featuresSource.getExtent();
    const polygon = fromExtent(extent);
    map.getView().fit(polygon, { padding: [50, 50, 50, 50] });

    if (useCluster) {
      // create a cluster source to group features that are close to each other
      vectorSource = new ClusterSource({
        distance: 40,
        source: featuresSource,
      });
    } else {
      // create a regular vector source
      vectorSource = featuresSource
    }

    const vectorLayer = new VectorLayer({
      id: 'sightings',
      source: vectorSource,
      style: useCluster ? clusterStyle : sightingStyle,
    });

    map.getLayers().forEach((layer) => {
      if (layer instanceof VectorLayer) {
        map.removeLayer(layer);
      }
    });

    map.addLayer(vectorLayer);

  }, [filteredSightings, useCluster, map]);

  const handleShowFeaturesButtonClick = () => {
    setShowFeaturesDrawer(true);
  };

  const handleShowFeaturesDrawerClose = () => {
    setShowFeaturesDrawer(false);
  };

  const handleOnRowClick = (record) => {
    const view = map.getView();
    const coords = fromLonLat([parseFloat(record.longitude), parseFloat(record.latitude)]);
    // animate to the selected feature, and keep current zoom level
    view.animate({ center: coords, zoom: view.getZoom() });
  };

  return (
    <div>
      <div style={{ position: 'absolute', top: 88, right: 24, zIndex: 1 }}>
        <Button icon={<UnorderedListOutlined />} style={{ width: '40px' }} onClick={handleShowFeaturesButtonClick} />
      </div>
      <div id="map-container" style={{ height: `calc(100vh - 64px - 24px)` }}></div>
      <Drawer
        open={showFeaturesDrawer}
        title="Observatii selectate"
        onClose={handleShowFeaturesDrawerClose}
        width={700}
        placement="right"
        mask={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <Checkbox
              checked={useCluster}
              onChange={(e) => setUseCluster(e.target.checked)}
            >Grupeaza observatiile</Checkbox>
          </div>
          <SightingsList sightings={sightingsInViewport} onDetailsClick={(record) => { setSelectedRecord(record); setDetailsModalVisible(true) }} onValidateClick={() => { }} onRowClick={handleOnRowClick} />
        </div>
      </Drawer>
      <SightingDetails record={selectedRecord} visible={detailsModalVisible} onClose={() => setDetailsModalVisible(false)} />
    </div>
  );
};

export default Maps;
