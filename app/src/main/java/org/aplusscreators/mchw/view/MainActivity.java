package org.aplusscreators.mchw.view;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import org.aplusscreators.mchw.R;

public class MainActivity extends AppCompatActivity {

    View formsMenu;
    View educationResourceMenu;
    View mapsMenuView;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        formsMenu = findViewById(R.id.forms_menu_view);
        educationResourceMenu = findViewById(R.id.education_menu_view);
        mapsMenuView = findViewById(R.id.maps_menu_view);

        formsMenu.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(MainActivity.this,AllFormsActivity.class);
                startActivity(intent);
            }
        });

        educationResourceMenu.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(MainActivity.this, AllEducationResourcesActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }
}
