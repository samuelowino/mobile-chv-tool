package org.aplusscreators.mchw.model;

public class Form {

    private String uuid;
    private String title;
    private String description;
    private String formName;

    public Form() {
    }

    public Form(String uuid, String title, String description, String formName) {
        this.uuid = uuid;
        this.title = title;
        this.description = description;
        this.formName = formName;
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

    public String getFormName() {
        return formName;
    }

    public void setFormName(String formName) {
        this.formName = formName;
    }

    @Override
    public String toString() {
        return "Form{" +
                "uuid='" + uuid + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", formName='" + formName + '\'' +
                '}';
    }
}
