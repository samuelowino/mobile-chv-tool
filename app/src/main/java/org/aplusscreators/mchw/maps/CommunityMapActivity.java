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
import com.google.android.gms.maps.model.MarkerOptions;

import org.aplusscreators.mchw.R;

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
        this.googleMap.addMarker(
                new MarkerOptions()
                        .position(new LatLng(12, 12))
                        .title("Current Location"));

        moveCamera(new LatLng(0.0236,37.9062),10,"Your Location",null);

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
