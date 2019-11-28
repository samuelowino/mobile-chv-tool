package org.aplusscreators.mchw.view;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityOptionsCompat;

import org.aplusscreators.mchw.R;

public class LoginActivity extends AppCompatActivity {

    EditText usernameEditText;
    EditText passwordEditText;
    View submitDetailedButton;
    ImageView sharedImageView;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        usernameEditText = findViewById(R.id.activity_login_username_field);
        passwordEditText = findViewById(R.id.activity_login_password_field);
        submitDetailedButton = findViewById(R.id.activity_login_proceed_button);
        sharedImageView = findViewById(R.id.login_chv_image_view);

        submitDetailedButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ActivityOptionsCompat activityOptionsCompat =
                        ActivityOptionsCompat.makeSceneTransitionAnimation(LoginActivity.this,sharedImageView,"brandTransition");
                Intent intent = new Intent(LoginActivity.this,MainActivity.class);
                startActivity(intent,activityOptionsCompat.toBundle());
                finish();
            }
        });
    }
}
