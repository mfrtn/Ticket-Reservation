interface PaymentI {
  api: string;

  send(amount: number, redirect: string): Promise<any>;
  verify(token: string): Promise<any>;
}

export default PaymentI;
