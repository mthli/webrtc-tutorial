import React from 'react';
import styled from '@emotion/styled';

import { withPrefix } from 'gatsby';

const Wrapper = styled.div({
  display: "flex",
});

export default function Logo() {
  return (
    <Wrapper>
      <img
        style={{ width: '24px' }}
        src={withPrefix('/icons/icon-48x48.png')}
        alt={'logo'}
      />
    </Wrapper>
  );
}