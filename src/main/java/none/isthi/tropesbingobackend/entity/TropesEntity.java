package none.isthi.tropesbingobackend.entity;

public class TropesEntity {
    private String title;
    private String address;
    private String description;

    public TropesEntity(){
        title = "Generic title";
        address= "www.example.com";
        description= "Generic Description";
    }

    public TropesEntity(String title, String address){
        this.title = title;
        this.address = address;
        this.description = "description goes here";
    }
    public TropesEntity(String title, String address, String description){
        this.title = title;
        this.address = address;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", address='" + address + '\'';
    }
}
