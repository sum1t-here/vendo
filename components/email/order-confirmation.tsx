import { Body, Container, Head, Heading, Hr, Html, Preview, Row, Column, Section, Text } from '@react-email/components';

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  variantValue?: string | null;
}

interface OrderConfirmationProps {
  customerName: string;
  orderId: string | number;
  items: OrderItem[];
  total: number;
  shippingAddress?: {
    name?: string | null;
    address1?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
    country?: string | null;
  };
}

export default function OrderConfirmation({
  customerName,
  orderId,
  items,
  total,
  shippingAddress,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Vendo order #{String(orderId)} is confirmed!</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          {/* Header */}
          <Section style={{ borderBottom: '3px solid #000', paddingBottom: '20px', marginBottom: '20px' }}>
            <Heading style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>VENDO</Heading>
          </Section>

          {/* Title */}
          <Heading style={{ fontSize: '24px', fontWeight: '900' }}>Order Confirmed ✅</Heading>
          <Text style={{ color: '#555', fontSize: '16px' }}>
            Hey {customerName}, your order has been placed successfully.
          </Text>

          {/* Order ID */}
          <Section
            style={{
              border: '2px solid #000',
              padding: '12px 16px',
              boxShadow: '4px 4px 0px #000',
              marginBottom: '24px',
              display: 'inline-block',
            }}
          >
            <Text
              style={{
                margin: 0,
                fontWeight: '900',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Order ID
            </Text>
            <Text style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>#{orderId}</Text>
          </Section>

          {/* Items */}
          <Heading style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Items Ordered
          </Heading>

          <Section style={{ border: '2px solid #000', marginBottom: '24px' }}>
            {/* Header row */}
            <Row style={{ borderBottom: '2px solid #000', padding: '10px 16px', backgroundColor: '#f5f5f5' }}>
              <Column style={{ fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}>Product</Column>
              <Column style={{ fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>
                Qty
              </Column>
              <Column style={{ fontWeight: '900', fontSize: '12px', textTransform: 'uppercase', textAlign: 'right' }}>
                Price
              </Column>
            </Row>

            {items.map((item, index) => (
              <Row
                key={index}
                style={{
                  padding: '12px 16px',
                  borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none',
                }}
              >
                <Column>
                  <Text style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{item.productName}</Text>
                  {item.variantValue && (
                    <Text style={{ margin: 0, fontSize: '12px', color: '#888' }}>{item.variantValue}</Text>
                  )}
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={{ margin: 0, fontSize: '14px' }}>{item.quantity}</Text>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>₹{item.price * item.quantity}</Text>
                </Column>
              </Row>
            ))}

            {/* Total */}
            <Row style={{ padding: '12px 16px', borderTop: '2px solid #000', backgroundColor: '#f5f5f5' }}>
              <Column>
                <Text style={{ margin: 0, fontWeight: '900', textTransform: 'uppercase', fontSize: '14px' }}>
                  Total
                </Text>
              </Column>
              <Column />
              <Column style={{ textAlign: 'right' }}>
                <Text style={{ margin: 0, fontWeight: '900', fontSize: '18px' }}>₹{total}</Text>
              </Column>
            </Row>
          </Section>

          {/* Shipping Address */}
          {shippingAddress?.address1 && (
            <>
              <Heading
                style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                Shipping To
              </Heading>
              <Section style={{ border: '2px solid #000', padding: '16px', marginBottom: '24px' }}>
                <Text style={{ margin: 0, fontWeight: 'bold' }}>{shippingAddress.name}</Text>
                <Text style={{ margin: 0, color: '#555' }}>{shippingAddress.address1}</Text>
                <Text style={{ margin: 0, color: '#555' }}>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                </Text>
                <Text style={{ margin: 0, color: '#555' }}>{shippingAddress.country}</Text>
              </Section>
            </>
          )}

          <Hr style={{ borderColor: '#000', borderWidth: '2px' }} />

          {/* Footer */}
          <Text style={{ color: '#888', fontSize: '12px', textAlign: 'center' }}>
            Questions? Email us at support@vendo.com
          </Text>
          <Text style={{ color: '#888', fontSize: '12px', textAlign: 'center' }}>
            © {new Date().getFullYear()} Vendo. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
