#include <iostream>
#include <fstream>
#include <string>
#include <thread>
#include <chrono>
#include <curl/curl.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;


size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp) {
    userp->append((char*)contents, size * nmemb);
    return size * nmemb;
}

void getDefinition(const std::string& text) {
    CURL* curl = curl_easy_init();
    if(curl) {
        std::string readBuffer;
        
        
        std::string apiUrl = "https://llm.aiqu.ai/v1/chat/completions";
        std::string modelName = "gpt-oss-120b";
        std::string apiKey = "sk-945-nOEFi0Crcw3QJl2tiA";

        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        std::string authHeader = "Authorization: Bearer " + apiKey;
        headers = curl_slist_append(headers, authHeader.c_str());

        json payload = {
            {"model", modelName},
            {"messages", json::array({
                {{"role", "system"}, {"content", "You are a helpful dictionary. Provide concise definitions."}},
                {{"role", "user"}, {"content", "Define this text: " + text}}
            })},
            {"temperature", 0.7}
        };
        std::string jsonStr = payload.dump();

        curl_easy_setopt(curl, CURLOPT_URL, apiUrl.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonStr.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);



        CURLcode res = curl_easy_perform(curl);
        if(res == CURLE_OK) {
            try {
                auto resJson = json::parse(readBuffer);
                if (resJson.contains("choices")) {
                    std::string definition = resJson["choices"][0]["message"]["content"];
                    std::cout << "\n========================================" << std::endl;
                    std::cout << "WORD: " << text << std::endl;
                    std::cout << "DEFINITION: " << definition << std::endl;
                    std::cout << "========================================\n" << std::endl;
                }
            } catch (...) {
                std::cerr << "Error parsing AiQu response: " << readBuffer << std::endl;
            }
        } else {
            std::cerr << "Request failed: " << curl_easy_strerror(res) << std::endl;
        }

        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
}

int main() {
    std::string lastProcessed = "";
    std::cout << "AiQu Backend Active. Monitoring highlights.json..." << std::endl;

    while (true) {
        std::ifstream file("highlights.json");
        if (file.is_open()) {
            json highlights;
            try {
                file >> highlights;
                if (!highlights.empty()) {
                    // Grab 'content' from the latest entry in your JSON
                    std::string currentText = highlights.back()["content"];
                    
                    if (currentText != lastProcessed && !currentText.empty()) {
                        getDefinition(currentText);
                        lastProcessed = currentText;
                    }
                }
            } catch (...) {
            }
            file.close();
        }

     
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
    return 0;
}