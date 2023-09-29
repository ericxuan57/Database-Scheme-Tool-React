import React, { useContext, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Button from '../../components/_ui/Button';
import Container from '../../components/_module/Container';
import Input from '../../components/_ui/Input';
import Modal from '../../components/_ui/Modal';
import styles from './styles.module.scss';
import { MainContext } from '../../context';
import { TCustomer } from '../../utils/types';
import { requiredObject, requiredString } from '../../utils/yup';

const validationSchema = requiredObject({
  customer_name: requiredString,
});

const CustomerPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { customerList, fetchCustomers } = useContext(MainContext);
  const [isShow, setIsShow] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<TCustomer>();
  const [newCustomer, setNewCustomer] = useState(false);

  useEffect(() => {
    reset({ customer_name: selectedCustomer?.customer_name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer]);

  const onSubmit = async (data: FieldValues) => {
    if (newCustomer) {
      await axios.post(`${process.env.REACT_APP_API_URL}/customer/create`, {
        customer_name: data.customer_name,
      });
    } else {
      await axios.put(`${process.env.REACT_APP_API_URL}/customer/update`, {
        customer_id: selectedCustomer?.customer_id,
        customer_name: data.customer_name,
      });
    }

    fetchCustomers();
    setIsShow(false);
  };

  return (
    <Container>
      <div>
        <Link to={'/'}>
          <Button className="mb-10">Home</Button>
        </Link>
        <div className={styles.wrapper}>
          {customerList.map(item => (
            <div key={item.customer_id} className={styles.content}>
              <div className={styles.customerName}>{item.customer_name}</div>
              <div className={styles.BtnGroup}>
                <Button
                  onClick={() => {
                    setIsShow(true);
                    setSelectedCustomer(item);
                    setNewCustomer(false);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="mt-10"
          onClick={() => {
            setIsShow(true);
            setNewCustomer(true);
            setSelectedCustomer(undefined);
          }}
        >
          Add New Customer
        </Button>
      </div>
      <Modal isShown={isShow} onClose={() => setIsShow(false)}>
        <form className={styles.Mcontent} onSubmit={handleSubmit(onSubmit)}>
          <Input className={styles.customerValue} register={register('customer_name')} error={errors.customer_name} />
          <div className={styles.BtnGroup}>
            <Button type="submit">{newCustomer ? 'Create' : 'Update'}</Button>

            <Button onClick={() => setIsShow(false)} buttonStyle="white">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
};

export default CustomerPage;
