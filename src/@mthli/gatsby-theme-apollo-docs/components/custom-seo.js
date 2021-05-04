import PropTypes from 'prop-types';
import React from 'react';
import { SEO } from 'gatsby-theme-apollo-core';
import { withPrefix } from 'gatsby';

export default function CustomSEO({ image, baseUrl, twitterHandle, ...props }) {
  const imagePath = withPrefix('/' + image);
  return (
    <SEO {...props} twitterCard="summary_large_image" favicon="/favicon-32x32.png">
      <meta name="google-site-verification" content="-qgu2UvNRmKmA2nlvPii0Ij_5KvDP7CoiPrrrt7fCDw" />
      <meta name="bytedance-verification-code" content="Di2CvrKo5GQhq+QNFxJc" />
      {baseUrl && <meta property="og:image" content={baseUrl + imagePath} />}
      {baseUrl && <meta name="twitter:image" content={baseUrl + imagePath} />}
      {twitterHandle && <meta name="twitter:site" content={`@${twitterHandle}`} />}
    </SEO>
  );
}

CustomSEO.propTypes = {
  baseUrl: PropTypes.string,
  image: PropTypes.string.isRequired,
  twitterHandle: PropTypes.string
};
