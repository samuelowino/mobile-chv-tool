package org.aplusscreators.mchw.view;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.aplusscreators.mchw.R;
import org.aplusscreators.mchw.adapter.EducationResourcesAdapter;
import org.aplusscreators.mchw.model.EducationResource;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AllEducationResourcesActivity extends AppCompatActivity {

    private static final String TAG = "AllEducationResourcesAc";

    public static final String EDUCATION_RESOURCE_SERIALIZED_KEY = "education_resource_serialized_key";
    RecyclerView recyclerView;
    EducationResourcesAdapter resourcesAdapter;
    Toolbar toolbar;
    List<EducationResource> resourcesList = new ArrayList<>();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_all_education_resources);

        recyclerView = findViewById(R.id.education_resources_recycler_view);
        toolbar = findViewById(R.id.all_education_resources_toolbar);

        resourcesList.add(new EducationResource(UUID.randomUUID().toString(), "Sanitation Education", "Sanitation is important for all, helping to maintain health and increase life-spans. However, it is especially important for children.", "sanitation", R.drawable.sanitation));
        resourcesList.add(new EducationResource(UUID.randomUUID().toString(), "Birth Education", "Birth control, family care as well as family support education resource for families", "birth", R.drawable.birth));
        resourcesList.add(new EducationResource(UUID.randomUUID().toString(), "HIV Education", "HIV stands for human immunodeficiency virus. It is the virus that can lead to acquired immunodeficiency syndrome or AIDS if not treated.", "birth", R.drawable.hiv));
        resourcesList.add(new EducationResource(UUID.randomUUID().toString(), "Malaria Control Education", "an intermittent and remittent fever caused by a protozoan parasite which invades the red blood cells and is transmitted by mosquitoes in many tropical and subtropical regions.", "birth", R.drawable.malaria));

        resourcesAdapter = new EducationResourcesAdapter(resourcesList, AllEducationResourcesActivity.this, new EducationResourcesAdapter.OnEducationResourceClickedListener() {
            @Override
            public void onEducationResourceClicked(int postition) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    EducationResource educationResource = resourcesList.get(postition);
                    Intent intent = new Intent(AllEducationResourcesActivity.this, EducationResourceRendererActivity.class);
                    String educationResSerialized = objectMapper.writeValueAsString(educationResource);
                    intent.putExtra(EDUCATION_RESOURCE_SERIALIZED_KEY, educationResSerialized);
                    startActivity(intent);
                } catch (Exception ex) {
                    Log.e(TAG, "onEducationResourceClicked: " + ex);
                }

            }
        });
        recyclerView.setLayoutManager(new LinearLayoutManager(AllEducationResourcesActivity.this));
        recyclerView.addItemDecoration(new DividerItemDecoration(AllEducationResourcesActivity.this, DividerItemDecoration.VERTICAL));
        recyclerView.setAdapter(resourcesAdapter);

        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null){
            getSupportActionBar().setDisplayShowHomeEnabled(true);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        Intent intent = new Intent(AllEducationResourcesActivity.this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}
