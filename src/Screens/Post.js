import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Image, Text, StyleSheet } from "react-native";
import { Heading, Card } from "material-bread";

import HTML from "react-native-render-html";
import Layout from "../Components/Layout";
import Loader from "../Components/Loader";

export default function Post({ match }) {
  const initialState = {
    post: null,
    isLoading: false,
    hasError: false
  };

  const [post, setPost] = useState(initialState.post);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [hasError, setHasError] = useState(initialState.hasError);

  const fetchPost = async () => {
    setIsLoading(true);
    const postId = match && match.params && match.params.id;

    try {
      const result = await fetch(`https://dev.to/api/articles/${postId}`);
      const data = await result.json();
      console.log(data);
      setPost(data);
      setHasError(false);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <Layout>
      <Card style={styles.postCard}>
        {post && post.cover_image ? (
          <Image
            source={{ uri: post && post.cover_image }}
            style={[
              {
                height: 300
              },
              styles.postImage
            ]}
          />
        ) : null}

        <Heading type={3} text={post && post.title} style={styles.title} />
        <Heading type={5} text={post && post.user && post.user.name} />
        {post && !isLoading ? (
          <HTML html={post.body_html} />
        ) : (
          <Loader isLoading={isLoading} />
        )}
        {hasError ? (
          <Text>Something went wrong fetching the post, please try again.</Text>
        ) : null}
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  postCard: {
    padding: 40,
    flex: 1,
    maxWidth: 825
  },
  postImage: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 12
  },
  title: {
    marginTop: 16,
    marginBottom: 8
  }
});

Post.propTypes = {
  match: PropTypes.object
};
