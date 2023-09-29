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
import { TSection } from '../../utils/types';
import { requiredObject, requiredString } from '../../utils/yup';

const validationSchema = requiredObject({
  section_name: requiredString,
});

const SectionPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { sectionList, fetchSections } = useContext(MainContext);
  const [isShow, setIsShow] = useState(false);
  const [selectedSection, setSelectedSection] = useState<TSection>();
  const [newSection, setNewSection] = useState(false);

  useEffect(() => {
    reset({ section_name: selectedSection?.section_name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection]);

  const onSubmit = async (data: FieldValues) => {
    if (newSection) {
      await axios.post(`${process.env.REACT_APP_API_URL}/section/create`, {
        section_name: data.section_name,
      });
    } else {
      await axios.put(`${process.env.REACT_APP_API_URL}/section/update`, {
        section_id: selectedSection?.section_id,
        section_name: data.section_name,
      });
    }

    fetchSections();
    setIsShow(false);
  };

  return (
    <Container>
      <div>
        <Link to={'/'}>
          <Button className="mb-10">Home</Button>
        </Link>
        <div className={styles.wrapper}>
          {sectionList.map(item => (
            <div key={item.section_id} className={styles.content}>
              <div className={styles.sectionName}>{item.section_name}</div>
              <div className={styles.BtnGroup}>
                <Button
                  onClick={() => {
                    setIsShow(true);
                    setSelectedSection(item);
                    setNewSection(false);
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
            setNewSection(true);
            setSelectedSection(undefined);
          }}
        >
          Add New Section
        </Button>
      </div>
      <Modal isShown={isShow} onClose={() => setIsShow(false)}>
        <form className={styles.Mcontent} onSubmit={handleSubmit(onSubmit)}>
          <Input className={styles.customerValue} register={register('section_name')} error={errors.section_name} />
          <div className={styles.BtnGroup}>
            <Button type="submit">{newSection ? 'Create' : 'Update'}</Button>

            <Button onClick={() => setIsShow(false)} buttonStyle="white">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
};

export default SectionPage;
