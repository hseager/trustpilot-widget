
(function(){
    class TrustpilotWidget {
        // Take apiKey + websiteName as params so that this component is reusable in the future
        constructor(apiKey, websiteName, parentElement){
            this.apiUrl = `https://api.trustpilot.com/v1/business-units/find?name=${websiteName}&apikey=${apiKey}`;
            this.htmlParentElement = parentElement;
            this.data = {};
        }
        getTrustPilotData(){
            fetch(this.apiUrl)
                .then(res => res.json())
                .then(data => this.data = data)
                .then(() => this.buildComponent())
                .catch(ex => console.log(ex)); // Could do error handling better in real world scenario like logging etc
        }
        getWordRating(rating){
            // I know the spec said to show 'Great' if score equals 4, but I think it makes sense for 4 and above too (4.5)
            let wordRating = '';
            if(rating == 5)
                wordRating = 'Excellent'
            else if(rating < 5 && rating >= 4)
                wordRating = 'Great'
            return wordRating;
        }
        buildComponent(){
            // Should probably handle missing data better then just using 'Optional Chaining' ? feature
            // Could actually add google rich snippets schema for reviews so that they can be used for SEO
            // Could make the 4.5/5 stars a nice image instead of text if I had more time
            if(!this.data) return
            let html = `
                <div class="trustpilot-widget">
                    <h3 class="trustpilot-widget-heading">${this.data?.displayName}</h3>
                    <blockquote class="trustpilot-widget-quote">&ldquo;${this.getWordRating(this.data?.score?.stars)}&rdquo;</blockquote>
                    <div class="trustpilot-widget-footer">
                        <p class="trustpilot-widget-text"><strong>${this.data?.score?.stars}</strong> out of <strong>5</strong> Stars based on <strong>${this.data?.numberOfReviews?.fiveStars}</strong> reviews</p>
                        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.fleximize.com%2Fimages%2Ftrustpilot-logo.png&f=1&nofb=1"
                    class="trustpilot-widget-logo" width="120px"/>
                    </div>
                    
                </div>
            `;
            if(this.htmlParentElement) // Maybe throw a warning here if html element is missing from page
                this.htmlParentElement.innerHTML = html;
        }
        init(){
            this.getTrustPilotData();
        }
    }
    
    const trustpilotWidget = new TrustpilotWidget(
        apiKey = 'CkGqKAS2ICoJWAp6UzoRLscwa8qY6Ey4', 
        websiteName = "fruugo.co.uk",
        parentElement = document.querySelector('.trustpilot-container'),
    );
    trustpilotWidget.init();
})()