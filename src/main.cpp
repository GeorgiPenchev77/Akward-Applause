#include <iostream>
#include <fstream>
#include <string>
#include "json.hpp" // Include the nlohmann library

using json = nlohmann::json;

int main() {
    // Open JSON file
    std::ifstream file("highlights.json");
    if (!file.is_open()) {
        std::cerr << "Could not open the file!" << std::endl;
        return 1;
    }

    // Parse the JSON data
    json data;
    file >> data;

    std::string content = data.back()["content"];
    std::string source = data.back()["source"];

    // make AI prompt
    std::string prompt = "Please give me a definition of this word\n";
    prompt += "Source: " + content + "\n";
    prompt += "Word: " + source + "\n";

    // Output the result 
    std::cout << prompt << std::endl;

    return 0;
}