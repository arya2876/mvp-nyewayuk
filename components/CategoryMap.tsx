"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Item } from "@prisma/client";
import { formatPrice } from "@/utils/helper";

// Import markercluster dynamically to avoid SSR issues
let MarkerClusterGroup: any = null;
if (typeof window !== "undefined") {
  require("leaflet.markercluster/dist/MarkerCluster.css");
  require("leaflet.markercluster/dist/MarkerCluster.Default.css");
  require("leaflet.markercluster");
  MarkerClusterGroup = (L as any).MarkerClusterGroup;
}

interface CategoryMapProps {
  listings: Item[];
  userLocation: { lat: number; lng: number } | null;
  onMarkerClick?: (listingId: string) => void;
}

const CategoryMap: React.FC<CategoryMapProps> = ({
  listings,
  userLocation,
  onMarkerClick,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: userLocation 
          ? [userLocation.lat, userLocation.lng] 
          : [-6.9825, 110.4093], // Default Semarang
        zoom: 13,
        zoomControl: true,
      });

      // Use OpenStreetMap tiles (free and reliable)
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(mapRef.current);

      // Initialize marker cluster group
      if (MarkerClusterGroup) {
        markersRef.current = new MarkerClusterGroup({
          chunkedLoading: true,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          maxClusterRadius: 60,
          iconCreateFunction: (cluster: any) => {
            const count = cluster.getChildCount();
            return L.divIcon({
              html: `<div class="cluster-marker">${count}</div>`,
              className: "custom-cluster-icon",
              iconSize: L.point(40, 40),
            });
          },
        });

        if (markersRef.current) {
          mapRef.current.addLayer(markersRef.current);
        }
      }
    }

    // Clear existing markers
    if (markersRef.current) {
      markersRef.current.clearLayers();
    }

    // Add user location marker
    if (userLocation && mapRef.current) {
      const userIcon = L.divIcon({
        html: `
          <div class="user-location-marker">
            <div class="pulse"></div>
            <div class="dot"></div>
          </div>
        `,
        className: "user-marker-container",
        iconSize: L.point(30, 30),
        iconAnchor: L.point(15, 15),
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup("<b>Lokasi Anda</b>");

      // Center map on user location
      mapRef.current.setView([userLocation.lat, userLocation.lng], 13);
    }

    // Add listing markers
    listings.forEach((listing) => {
      if (!listing.latlng || listing.latlng.length < 2 || !markersRef.current) return;

      const lat = listing.latlng[0];
      const lng = listing.latlng[1];

      const priceIcon = L.divIcon({
        html: `
          <div class="price-marker">
            <span>Rp ${formatPrice(listing.price)}</span>
          </div>
        `,
        className: "price-marker-container",
        iconSize: L.point(80, 32),
        iconAnchor: L.point(40, 32),
      });

      const marker = L.marker([lat, lng], { icon: priceIcon });

      // Popup content - clickable to navigate
      const popupContent = `
        <a href="/listings/${listing.id}" class="listing-popup-link" style="text-decoration: none; color: inherit; display: block;">
          <div class="listing-popup">
            <img src="${listing.imageSrc}" alt="${listing.title}" class="popup-image" />
            <div class="popup-content">
              <h3 class="popup-title">${listing.title}</h3>
              <p class="popup-location">${listing.district || ""}, ${listing.city || ""}</p>
              <p class="popup-price">Rp ${formatPrice(listing.price)}/hari</p>
              <p class="popup-cta">Klik untuk lihat detail →</p>
            </div>
          </div>
        </a>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 250,
        className: "custom-popup",
      });

      // Double click on marker navigates directly
      marker.on("dblclick", () => {
        if (onMarkerClick) {
          onMarkerClick(listing.id);
        }
      });

      markersRef.current.addLayer(marker);
    });

    return () => {
      // Cleanup on unmount
    };
  }, [listings, userLocation, onMarkerClick]);

  return (
    <>
      <style jsx global>{`
        .cluster-marker {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          border: 3px solid white;
        }

        .custom-cluster-icon {
          background: transparent !important;
        }

        .price-marker {
          background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
          border: 2px solid white;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .price-marker:hover {
          transform: scale(1.1);
        }

        .price-marker-container {
          background: transparent !important;
        }

        .user-location-marker {
          position: relative;
          width: 30px;
          height: 30px;
        }

        .user-location-marker .pulse {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.3);
          animation: pulse 2s infinite;
        }

        .user-location-marker .dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #10b981;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .user-marker-container {
          background: transparent !important;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .listing-popup {
          min-width: 200px;
        }

        .popup-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px 8px 0 0;
        }

        .popup-content {
          padding: 12px;
        }

        .popup-title {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          color: #1f2937;
        }

        .popup-location {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .popup-price {
          font-weight: 700;
          font-size: 14px;
          color: #10b981;
        }

        .popup-cta {
          font-size: 11px;
          color: #a855f7;
          margin-top: 8px;
          font-weight: 500;
        }

        .listing-popup-link:hover .popup-cta {
          text-decoration: underline;
        }

        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }

        .custom-popup .leaflet-popup-content {
          margin: 0;
        }

        .leaflet-popup-close-button {
          color: white !important;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 24px !important;
          height: 24px !important;
          font-size: 16px !important;
          line-height: 24px !important;
          text-align: center;
          top: 8px !important;
          right: 8px !important;
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full" />
    </>
  );
};

export default CategoryMap;
