const payload = {
  index: "movies",
  body: {
    settings: {
      analysis: {
        analyzer: {
          my_analyzer: {
            tokenizer: "my_tokenizer",
          },
        },
        tokenizer: {
          my_tokenizer: {
            type: "edge_ngram",
            min_gram: 1,
            max_gram: 10,
            token_chars: ["letter", "digit"],
          },
        },
      },
    },
    mappings: {
      properties: {
        id: {
          type: "integer",
        },
        title: {
          type: "string",
          analyzer: "indexing_analyzer",
        },
        genres: {
          type: "keyword",
        },
        original_language: {
          type: "keyword",
        },
        overview: {
          type: "text",
        },
        popularity: {
          type: "float",
        },
        release_date: {
          type: "date",
        },
        vote_average: {
          type: "float",
        },
        vote_count: {
          type: "integer",
        },
      },
    },
  },
};

export default payload;
