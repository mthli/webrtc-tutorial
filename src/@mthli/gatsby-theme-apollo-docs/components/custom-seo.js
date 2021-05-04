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
      <script>
        {`
          (function(){
            var el = document.createElement("script");
            el.src = "https://sf1-scmcdn-tos.pstatp.com/goofy/ttzz/push.js?640b72aa3e4fdf9ffd1a9a05fc714e9cdddc3da3a07c6d62b917ee7736a67eed8d4676f17aecfe4838ef223da837021a5615cc802677690824ac7c88ac0f6a982b8d7c8c6655c9b00211740aa8a98e2e";
            el.id = "ttzz";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(el, s);
          })(window)
        `}
      </script>
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
