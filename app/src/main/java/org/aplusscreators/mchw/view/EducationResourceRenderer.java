package org.aplusscreators.mchw.view;

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

import org.aplusscreators.mchw.R;

public class EducationResourceRenderer extends AppCompatActivity {

    private static final String TAG = "EducationResourceRender";
    WebView resourcesWebView;
    WebSettings webSettings;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_resource_renderer);

        resourcesWebView = findViewById(R.id.resources_web_view);
        webSettings = resourcesWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        resourcesWebView.setWebViewClient( new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Log.e(TAG, "onReceivedError: " + error );
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
        resourcesWebView.loadUrl(composeUrl());

    }

    private String composeUrl() {
        return null;
    }
}
