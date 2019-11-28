package org.aplusscreators.mchw.model;

public class EducationResource {

    public String uuid;
    public String title;
    public String description;
    public String htmlFileUrl;
    public int drawableResourceId;

    public EducationResource() {
    }

    public EducationResource(String uuid, String title, String description, String htmlFileUrl, int drawableResourceId) {
        this.uuid = uuid;
        this.title = title;
        this.description = description;
        this.htmlFileUrl = htmlFileUrl;
        this.drawableResourceId = drawableResourceId;
    }

    public int getDrawableResourceId() {
        return drawableResourceId;
    }

    public void setDrawableResourceId(int drawableResourceId) {
        this.drawableResourceId = drawableResourceId;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHtmlFileUrl() {
        return htmlFileUrl;
    }

    public void setHtmlFileUrl(String htmlFileUrl) {
        this.htmlFileUrl = htmlFileUrl;
    }

    @Override
    public String toString() {
        return "EducationResource{" +
                "uuid='" + uuid + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", htmlFileUrl='" + htmlFileUrl + '\'' +
                '}';
    }
}
