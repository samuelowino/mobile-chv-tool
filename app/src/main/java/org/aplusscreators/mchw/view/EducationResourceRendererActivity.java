package org.aplusscreators.mchw.view;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.aplusscreators.mchw.R;
import org.aplusscreators.mchw.model.EducationResource;

public class EducationResourceRendererActivity extends AppCompatActivity {

    private static final String TAG = "EducationResourceRender";

    private final String postFix = ".html";
    private final String prefix = "file:///android_asset/www/";

    Toolbar toolbar;
    WebView resourcesWebView;
    WebSettings webSettings;
    EducationResource educationResource;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_resource_renderer);

        resourcesWebView = findViewById(R.id.resources_web_view);
        webSettings = resourcesWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        resourcesWebView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Log.e(TAG, "onReceivedError: " + error);
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }
        });

    }

    private String composeUrl() {
        return prefix + educationResource.getHtmlFileUrl() + postFix;
    }

    @Override
    protected void onStart() {
        super.onStart();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Intent data = getIntent();
            String educationResourceSerialized = data.getStringExtra(AllEducationResourcesActivity.EDUCATION_RESOURCE_SERIALIZED_KEY);
            educationResource = objectMapper.readValue(educationResourceSerialized, EducationResource.class);
            resourcesWebView.loadUrl(composeUrl());

        } catch (Exception ex) {
            Log.e(TAG, "onStart: " + ex);
        }

    }
}
