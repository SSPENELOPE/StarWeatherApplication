class Suggestions {
    async cacheCitySuggestions() {
        const response = await fetch('api/GetJson');
        const data = await response.json();
        localStorage.setItem("citySuggestions", JSON.stringify(data))
    }

    // Check if the city suggestions are already cached, and fetch them if not
    async getCachedCitySuggestions() {
        let suggestions = JSON.parse(localStorage.getItem("citySuggestions"));
        if (!suggestions) {
            await this.cacheCitySuggestions();
            suggestions = JSON.parse(localStorage.getItem("citySuggestions"));
        }
        return suggestions;
    }
}

export default new Suggestions;