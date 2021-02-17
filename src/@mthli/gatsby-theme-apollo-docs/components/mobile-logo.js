import React from 'react';
import styled from '@emotion/styled';

import { withPrefix } from 'gatsby';

const Wrapper = styled.div({
  display: 'flex',
  marginRight: '-12px',
});

class MobileLogo extends React.PureComponent {
  render() {
    return (
      <Wrapper>
        <img
          style={{
            margin: 0,
            maxWidth: '32px',
           }}
          src={withPrefix('/icons/icon-96x96.png')}
          alt={'logo'}
        />
      </Wrapper>
    );
  }
}

export { MobileLogo }
