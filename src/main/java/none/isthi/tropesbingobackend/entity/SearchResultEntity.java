package none.isthi.tropesbingobackend.entity;

public class SearchResultEntity {
    private String title;
    private String description;
    private String imgUrl;
    private String address;


    public SearchResultEntity(String title, String description, String imgUrl, String address) {
        this.title = title;
        this.description = description;
        this.imgUrl = imgUrl;
        this.address = address;
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

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
