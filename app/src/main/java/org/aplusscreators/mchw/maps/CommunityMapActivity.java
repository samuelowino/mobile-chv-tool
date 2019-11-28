package org.aplusscreators.mchw.maps;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import org.aplusscreators.mchw.R;

import java.util.Arrays;
import java.util.List;

public class CommunityMapActivity extends AppCompatActivity implements OnMapReadyCallback {

    SupportMapFragment mapFragment;
    GoogleMap googleMap;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_community_map);

        mapFragment = (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.comunity_map_fragment);
        mapFragment.getMapAsync(this);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        this.googleMap = googleMap;
        this.googleMap.setMapType(GoogleMap.MAP_TYPE_SATELLITE);

        moveCamera(new LatLng(0.290393,34.764353),16,"Your Location",null);

        for (MarkerOptions markerOption : getMarkerOptions()) {
            Marker marker  = this.googleMap.addMarker(markerOption);
            marker.showInfoWindow();
        }

    }

    private List<MarkerOptions> getMarkerOptions(){
        List<MarkerOptions> markerOptionsList = Arrays.asList(
                new MarkerOptions()
                        .position(new LatLng(0.290393, 34.764353))
                        .title("Current Location")
                .snippet(""),

                new MarkerOptions()
                        .position(new LatLng(0.289250, 34.766167))
                        .title("House A")
                .snippet(""),

                new MarkerOptions()
                        .position(new LatLng(0.288083, 34.761806))
                        .title("House B"),

                new MarkerOptions()
                        .position(new LatLng(0.2877668,34.761941))
                        .title("House C"),

                new MarkerOptions()
                        .position(new LatLng(0.288056, 34.766194))
                        .title("House D"),
                new MarkerOptions()
                        .position(new LatLng(0.2886741,34.7617654))
                        .title("House E"),

                new MarkerOptions()
                        .position(new LatLng(0.2890498,34.7646756))
                        .title("House F"),

                new MarkerOptions()
                        .position(new LatLng(0.28925,34.7656195))
                        .title("House B"),
                new MarkerOptions()
                        .position(new LatLng(0.289708, 34.760635))
                        .title("House C"),

                new MarkerOptions()
                        .position(new LatLng(0.287584, 34.763553))
                        .title("House D"),
                new MarkerOptions()
                        .position(new LatLng(0.290255, 34.764079))
                        .title("House E"),

                new MarkerOptions()
                        .position(new LatLng(0.287262, 34.767029))
                        .title("House F")
        );

        return markerOptionsList;


    }

    private void moveCamera(LatLng latLng, float zoom, String placeTitle, LatLngBounds latLngBounds) {
        if (latLngBounds == null) {
            googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(latLng, zoom), 10, null);
            if (!placeTitle.equalsIgnoreCase("Your Location"))
                googleMap.addMarker(new MarkerOptions().position(latLng).title(placeTitle)).showInfoWindow();
        } else {
            if (!placeTitle.equalsIgnoreCase("Your Location"))
                googleMap.addMarker(new MarkerOptions().position(latLng).title(placeTitle)).showInfoWindow();

            googleMap.animateCamera(CameraUpdateFactory.newLatLngBounds(latLngBounds, 10), 10, null);
        }

    }
}
