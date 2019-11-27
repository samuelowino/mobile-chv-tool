package org.aplusscreators.mchw.view;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.aplusscreators.mchw.R;
import org.aplusscreators.mchw.adapter.EducationResourcesAdapter;
import org.aplusscreators.mchw.model.EducationResource;

import java.util.List;

public class AllEducationResourcesActivity extends AppCompatActivity {

    RecyclerView recyclerView;
    EducationResourcesAdapter resourcesAdapter;
    List<EducationResource> resourcesList;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_all_education_resources);

        recyclerView = findViewById(R.id.education_resources_recycler_view);
        resourcesAdapter = new EducationResourcesAdapter(resourcesList, AllEducationResourcesActivity.this, new EducationResourcesAdapter.OnEducationResourceClickedListener() {
            @Override
            public void onEducationResourceClicked(int postition) {
                Intent intent = new Intent(AllEducationResourcesActivity.this, EducationResourceRenderer.class);
                startActivity(intent);
            }
        });
        recyclerView.setLayoutManager( new LinearLayoutManager(AllEducationResourcesActivity.this));
        recyclerView.setAdapter(resourcesAdapter);

    }
}
