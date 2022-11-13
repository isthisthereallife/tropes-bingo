package none.isthi.tropesbingobackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import none.isthi.tropesbingobackend.entity.SearchResultEntity;
import none.isthi.tropesbingobackend.entity.TropesEntity;
import org.jsoup.HttpStatusException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Collections;

@RestController
@RequestMapping("/tropesbingo/")
public class TropesController {

    @GetMapping("search/{query}/{pageNumber}")
    @CrossOrigin(origins = "http://localhost:5050")
    public String searchForItem(@PathVariable String query, @PathVariable int pageNumber) throws IOException {
        try {
            System.out.println("Searchquery: " + query);
            Document searchDoc = Jsoup.connect("https://tvtropes.org/pmwiki/elastic_search_result.php?q=" + query + "&page_type=work&search_type=article&page=" + pageNumber).get();
            Elements searchResults = searchDoc.select("a[class=search-result]");
            ArrayList<SearchResultEntity> searchResultEntities = new ArrayList<>();

            for (Element e : searchResults) {
                String img = e.select("img").attr("src").contains("search-noImage") ? "https://tvtropes.org/img/search-noImage-422x242.jpg" : e.select("img").attr("src");
                SearchResultEntity sRe = new SearchResultEntity(e.select("p:eq(0)").text(), e.text().substring(e.select("p:eq(0)").text().length()), img, e.attributes().get("href"));
                searchResultEntities.add(sRe);
            }
            ObjectMapper om = new ObjectMapper();
            return om.writeValueAsString(searchResultEntities);
        } catch (MalformedURLException e) {
            System.out.println("ERRRRORRR: \n\n" + e);
            return null;
        }
    }


    @PostMapping("/{gridSize}")
    @CrossOrigin(origins = "http://localhost:5050")
    public String getTropes(@PathVariable int gridSize, @RequestBody String url) throws IOException, NullPointerException {
        //supplying the end part of a url to a film
        //cut out the tropes, add to this list
        if (5 <= gridSize) gridSize = 5;
        System.out.println("Asking for gridSize: " + gridSize + "tropes for work: " + url);

        ArrayList<TropesEntity> tropeList = new ArrayList<>();
        try {
            Document tropeDoc = Jsoup.connect("https://tvtropes.org" + url).get();
            Elements aTagsInLi = tropeDoc.select("ul li a:eq(0).twikilink[title^=/pmwiki/pmwiki.php/Main/]");
            for (Element aTag : aTagsInLi) {
                assert aTag.parent() != null;
                if (aTag.parent().html().startsWith("<a")) {
                    TropesEntity tE = new TropesEntity(aTag.html(), aTag.absUrl("href"), aTag.parent().text());
                    tropeList.add(tE);
                }
            }
            while (tropeList.size() < gridSize * gridSize) {
                tropeList.add(new TropesEntity("FREE SPACE", "", "Not enough tropes listed on the page...¯\\_(ツ)_/¯"));
            }
        } catch (HttpStatusException e) {
            while (tropeList.size() < gridSize * gridSize) {
                tropeList.add(new TropesEntity("FREE SPACE", "", "404, that page didn't exist!"));
            }
        }
        ObjectMapper om = new ObjectMapper();
        Collections.shuffle(tropeList);
        return om.writeValueAsString(tropeList);
    }
}
