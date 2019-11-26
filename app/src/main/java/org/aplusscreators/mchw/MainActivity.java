package org.aplusscreators.mchw;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {

    View formsMenu;
    View educationResourceMenu;
    View registrationsMenu;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        formsMenu = findViewById(R.id.forms_menu_view);
        educationResourceMenu = findViewById(R.id.education_menu_view);
        registrationsMenu = findViewById(R.id.cohorts_menu_view);


    }
}
