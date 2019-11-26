package org.aplusscreators.mchw;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;

import android.view.MenuItem;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.fasterxml.jackson.databind.ObjectMapper;

public class FormsWebViewActivity extends AppCompatActivity {

    private static final String TAG = "FormsWebViewActivity";
    private final String postFix = ".html";
    private final String prefix = "file:///android_asset/www/";

    Form form;
    Toolbar toolbar;
    WebView formWebView;
    WebSettings webSettings;
    ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forms_webview);

        formWebView = findViewById(R.id.forms_activity_webview);
        toolbar = findViewById(R.id.activity_forms_toolbar);

        webSettings = formWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        formWebView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Toast.makeText(getApplicationContext(), "An Error Occurred", Toast.LENGTH_LONG).show();
            }
        });

        formWebView.loadUrl(composeUrl());


    }

    private String composeUrl() {
        return prefix + "chew" + postFix;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                Intent intent = new Intent(FormsWebViewActivity.this,AllFormsActivity.class);
                startActivity(intent);
                break;
            default:
                return false;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onStart() {
        super.onStart();
        try {
            Intent data = getIntent();
            String formSerialized = data.getStringExtra(AllFormsActivity.SERIALIZED_FORM_ENTRY_KEY);
            form = objectMapper.readValue(formSerialized, Form.class);
            setSupportActionBar(toolbar);
            if (getSupportActionBar() != null) {
                getSupportActionBar().setTitle(form.getTitle());
                getSupportActionBar().setDisplayShowHomeEnabled(true);
                getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            }
        } catch (Exception ex) {
            Log.e(TAG, "onStart: " + ex);
        }


    }
}
