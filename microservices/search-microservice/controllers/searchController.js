// const { getPostData } = require('../utils');
const searchModel = require('../models/searchModel');
const levenshtein = require('js-levenshtein');


async function searchAlgorithm(req, res, query, limit, offset) {
    try {
        console.log("Query:", query);

        const searchQuery = query.split("%20");
        console.log("Search query:", searchQuery);

        const wordVector = searchQuery;

        const positiveWords = ["just", "only", "doar", "neaparat", "numai"];
        const negativeWords = ["fara", "without"];
        const linkWords = ["and", "si", "or", "sau"];

        // Levenshtein distance - delete, insert, replace - used for normalizing words
        const specializedDictionary = ["java", "opengl", "3d", "three.js", "art", "nature of code", "nature", "code", "book", "books"];
        const specializedWords = wordVector.filter(word => {
            const lowerWord = word.toLowerCase();
            return specializedDictionary.some(dictWord => levenshtein(lowerWord, dictWord) <= 1);
        }).map(word => {
            const lowerWord = word.toLowerCase();
            const match = specializedDictionary.find(dictWord => levenshtein(lowerWord, dictWord) <= 1);
            return match || word;
        });

        const naturalDictionary = ["neaparat", "doar", "only", "just", "numai", "fara", "without", "and", "si", "or", "sau"];
        const naturalWords = wordVector.filter(word => {
            const lowerWord = word.toLowerCase();
            return naturalDictionary.some(dictWord => levenshtein(lowerWord, dictWord) <= 1);
        }).map(word => {
            const lowerWord = word.toLowerCase();
            const match = naturalDictionary.find(dictWord => levenshtein(lowerWord, dictWord) <= 1);
            return match || word;
        });

        console.log("Specialized words:", specializedWords);
        console.log("Natural words:", naturalWords);

        const positiveGroup = [];
        const negativeGroup = [];

        for (let i = 0; i < wordVector.length - 1; i++) {
            if (positiveWords.includes(wordVector[i].toLowerCase())) {
                let group = `${wordVector[i]} ${wordVector[i + 1]}`;
                if (i < wordVector.length - 2 && linkWords.includes(wordVector[i + 2].toLowerCase())) {
                    group += ` ${wordVector[i + 2]}`;
                    group += ` ${wordVector[i + 3]}`;
                }
                positiveGroup.push(group);
            }
            if (negativeWords.includes(wordVector[i].toLowerCase())) {
                let group = `${wordVector[i]} ${wordVector[i + 1]}`;
                if (i < wordVector.length - 2 && linkWords.includes(wordVector[i + 2].toLowerCase())) {
                    group += ` ${wordVector[i + 2]}`;
                    group += ` ${wordVector[i + 3]}`;
                }
                negativeGroup.push(group);
            }
        }

        console.log("Positive groups:", positiveGroup);
        console.log("Negative groups:", negativeGroup);

        if (naturalWords.length == 0) {
            searchModel.getResourcesByWords(specializedWords, limit, offset)
                .then((data) => {

                    const results = data.map(item => {
                        const { title, summary, description } = item;

                        const wordCounts = specializedWords.reduce((counts, word) => {
                            const regex = new RegExp(word, 'gi');
                            const titleCount = (title.match(regex) || []).length;
                            const summaryCount = (summary.match(regex) || []).length;
                            const descriptionCount = (description.match(regex) || []).length;

                            counts[word] = titleCount * 5 + summaryCount * 3 + descriptionCount * 2;

                            return counts;
                        }, {});

                        const totalCount = Object.values(wordCounts).reduce((sum, count) => sum + count, 0);

                        return {
                            resource: item,
                            totalCount
                        };
                    });
                    results.sort((a, b) => b.totalCount - a.totalCount);

                    const sortedResources = results.map(result => result.resource);

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(sortedResources));
                })
                .catch((err) => {
                    console.error("Error fetching resources:", err);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: err.message }));
                });
        } else {
            const hasPositiveWords = naturalWords.some(word => positiveWords.includes(word.toLowerCase()));
            const hasNegativeWords = naturalWords.some(word => negativeWords.includes(word.toLowerCase()));

            if (hasPositiveWords && !hasNegativeWords) {
                searchModel.getResourcesByWords(specializedWords, limit, offset)
                    .then((data) => {

                        const results = data.map(item => {
                            const { title, summary, description } = item;

                            const wordCounts = specializedWords.reduce((counts, word) => {
                                const regex = new RegExp(word, 'gi');
                                const titleCount = (title.match(regex) || []).length;
                                const summaryCount = (summary.match(regex) || []).length;
                                const descriptionCount = (description.match(regex) || []).length;

                                counts[word] = titleCount * 5 + summaryCount * 3 + descriptionCount * 2;

                                return counts;
                            }, {});

                            const totalCount = Object.values(wordCounts).reduce((sum, count) => sum + count, 0);

                            return {
                                resource: item,
                                totalCount
                            };
                        });
                        results.sort((a, b) => b.totalCount - a.totalCount);

                        const sortedResources = results.map(result => result.resource);

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(sortedResources));
                    })
                    .catch((err) => {
                        console.error("Error fetching resources:", err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: err.message }));
                    });
            } else if (!hasPositiveWords && hasNegativeWords) {
                searchModel.getAllExceptSpecialWords(specializedWords, limit, offset)
                    .then((data) => {

                        const results = data.map(item => {
                            const { title, summary, description } = item;

                            const wordCounts = specializedWords.reduce((counts, word) => {
                                const regex = new RegExp(word, 'gi');
                                const titleCount = (title.match(regex) || []).length;
                                const summaryCount = (summary.match(regex) || []).length;
                                const descriptionCount = (description.match(regex) || []).length;

                                counts[word] = titleCount * 5 + summaryCount * 3 + descriptionCount * 2;

                                return counts;
                            }, {});

                            const totalCount = Object.values(wordCounts).reduce((sum, count) => sum + count, 0);

                            return {
                                resource: item,
                                totalCount
                            };
                        });
                        results.sort((a, b) => b.totalCount - a.totalCount);

                        const sortedResources = results.map(result => result.resource);

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(sortedResources));
                    })
                    .catch((err) => {
                        console.error("Error fetching resources:", err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: err.message }));
                    });
            } else if (hasPositiveWords && hasNegativeWords) {
                searchModel.getResourcesByGroups(positiveGroup, negativeGroup, specializedDictionary, limit, offset)
                    .then((data) => {

                        const results = data.map(item => {
                            const { title, summary, description } = item;

                            const wordCounts = specializedWords.reduce((counts, word) => {
                                const regex = new RegExp(word, 'gi');
                                const titleCount = (title.match(regex) || []).length;
                                const summaryCount = (summary.match(regex) || []).length;
                                const descriptionCount = (description.match(regex) || []).length;

                                counts[word] = titleCount * 5 + summaryCount * 3 + descriptionCount * 2;

                                return counts;
                            }, {});

                            const totalCount = Object.values(wordCounts).reduce((sum, count) => sum + count, 0);

                            return {
                                resource: item,
                                totalCount
                            };
                        });
                        results.sort((a, b) => b.totalCount - a.totalCount);

                        const sortedResources = results.map(result => result.resource);

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(sortedResources));
                    })
                    .catch((err) => {
                        console.error("Error fetching resources:", err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: err.message }));
                    });
            }
        }
    } catch (err) {
        console.error("Error in searchAlgorithm:", err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: err.message }));
    }
}

module.exports = { searchAlgorithm };
