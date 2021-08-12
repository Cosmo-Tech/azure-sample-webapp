// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import renderer from 'react-test-renderer';
import LoadingLine from '../LoadingLine';

describe('LoadingLine test suite', () => {
  console.error = jest.fn();

  it('should log errors when no props are passed', () => {
    renderer.create(<LoadingLine />).toJSON();
    expect(console.error).toHaveBeenCalledTimes(5);
  });

  it('should render correctly when all props are here', () => {
    const elem = renderer.create(
      <LoadingLine
        titleKey={'test.all.props.key'}
        width={120}
        height={120}
        isLoading={true}
        hasError={false}
      />
    ).toJSON();
    expect(elem).toMatchSnapshot();
  });

  it('should render correctly when its loading', () => {
    const elem = renderer.create(
      <LoadingLine
        titleKey={'test.is.loading.key'}
        width={120}
        height={120}
        isLoading={true}
        hasError={false}
      />
    ).toJSON();
    expect(elem).toMatchSnapshot();
  });

  it('should render correctly when its loaded', () => {
    const elem = renderer.create(
      <LoadingLine
        titleKey={'test.is.loaded.key'}
        width={120}
        height={120}
        isLoading={false}
        hasError={false}
      />
    ).toJSON();
    expect(elem).toMatchSnapshot();
  });

  it('should render correctly when it has errors', () => {
    const elem = renderer.create(
      <LoadingLine
        titleKey={'test.has.errors.key'}
        width={120}
        height={120}
        isLoading={false}
        hasError={true}
      />
    ).toJSON();
    expect(elem).toMatchSnapshot();
  });
});
