import PropTypes from 'prop-types';

function ProductLoading(Component) {
  const ProductLoadingComponent = ({ isLoading, ...props }) => {
    if (!isLoading) {
      return <Component {...props} />;
    }
    return (
      <p style={{ fontSize: '20px', textAlign: 'center' }}>
        We are waiting for the data to load...
      </p>
    );
  };

  ProductLoadingComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired, // `isLoading` doit être un booléen
  };

  return ProductLoadingComponent;
}

export default ProductLoading;
