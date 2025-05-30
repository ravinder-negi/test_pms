/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import { BasicInfoStyle, PersonalInfoStyle, ProfileBox } from '../ViewEmployeeStyle';
import AvatarImage from '../../../../components/common/AvatarImage';
import { EditIcon, TrashIconNew } from '../../../../theme/SvgIcons';
import { Skeleton } from 'antd';
import {
  checkPermission,
  currentModule,
  formatPhone,
  getFullName,
  isImageValid
} from '../../../../utils/common_functions';
import { FlexWrapper } from '../../../../theme/common_style';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEmployeeApi } from '../../../../redux/employee/apiRoute';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import UpdatePassword from '../modals/UpdatePassword';
import CircularProgressBar from '../../../../components/common/CircularProgress';
import DefaultProfile from '../../../../assets/DefaultProfile.jpg';
import styled from '@emotion/styled';
import uploadFileToS3 from '../../../../utils/uploadS3Bucket';
import moment from 'moment';
import CreateEmployees from '../../CreateEmployees';
import EditCurrentAddress from './edit-employee/EditCurrentAddress';
// import { Skeleton } from 'antd';

const BasicInfo = ({ loading, details, handleList }) => {
  const { permissions } = useSelector((state) => state?.userInfo?.data);
  let permissionSection = currentModule();
  const canUpdate = checkPermission(permissionSection, 'update', permissions);
  const [isCurrentAddressOpen, setIsCurrentAddressOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [isCurrentAddress, setIsCurrentAddress] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [passwordModal, setPasswordModal] = useState(false);
  const image_baseurl = process.env.REACT_APP_S3_BASE_URL;
  const fileInputRef = useRef(null);
  const [uploadText, setUploadText] = useState('Loading...');
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [data, setData] = useState(null);
  // const secretKey = process.env.REACT_APP_CRYPTO_SECRET_KEY;

  // const decryptPan = (encryptedPan) => {
  //   try {
  //     if (encryptedPan) {
  //       const bytes = CryptoJS.AES.decrypt(encryptedPan, secretKey);
  //       const originalText = bytes.toString(CryptoJS.enc.Utf8);
  //       return originalText || 'N/A'; // If decryption fails, return 'N/A'
  //     }
  //     return 'N/A'; // Return 'N/A' if no encrypted PAN is present
  //   } catch (error) {
  //     console.error('Error decrypting PAN:', error);
  //     return 'N/fA'; // Return 'N/A' in case of error
  //   }
  // };

  // async function decryptPan(encrypted, password = secretKey) {
  //   const [ivHex, encryptedHex] = encrypted?.split(':');
  //   const iv = CryptoJS.enc.Hex.parse(ivHex);
  //   const salt = new TextEncoder().encode('salt');

  //   const keyBuffer = await scrypt(
  //     new TextEncoder().encode(password), // password = CRYPTO_SECRET
  //     salt,
  //     16384, // N
  //     8, // r
  //     1, // p
  //     32 // key length
  //   );

  //   const keyWords = CryptoJS.lib.WordArray.create(keyBuffer);

  //   const decrypted = CryptoJS.AES.decrypt(
  //     { ciphertext: CryptoJS.enc.Hex.parse(encryptedHex) },
  //     keyWords,
  //     {
  //       iv: iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     }
  //   );

  //   return decrypted.toString(CryptoJS.enc.Utf8);
  // }

  // const handleEditClick = () => {
  //   fileInputRef.current?.click();
  // };

  const handleCancelAddressOpen = () => {
    setIsCurrentAddressOpen(false);
  };

  const handleSetIsCurrentAddressOpen = (type) => {
    setIsCurrentAddress(type == 'Current' ? true : false);
    setIsCurrentAddressOpen(!isCurrentAddressOpen);
    setData(type == 'Current' ? details?.currentAddress : details?.permanentAddress);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadFileToS3(file, `employee/profileImg/${id}.jpg`);
        toast.success('File uploaded');
        getTextNameUpload();
        setImageVersion(Date.now());
      } catch {
        toast.error('Failed to upload file. Please try again.');
      }
    }
  };

  const getProfileImage = (id) => {
    return image_baseurl + 'employee/profileImg/' + id + '.jpg';
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      let res = await deleteEmployeeApi(id);
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Employee deleted successfully');
        navigate('/employee');
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatUDID = (udid) => {
    const cleaned = udid.replace(/\D/g, '');

    if (cleaned.length !== 12) return udid;

    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`;
  };

  const getTextNameUpload = async () => {
    let response = await isImageValid(`${image_baseurl}employee/profileImg/${id}.jpg`);
    if (response) {
      setUploadText('Edit Image');
    } else {
      setUploadText('Upload Image');
    }
  };

  useEffect(() => {
    getTextNameUpload();
  }, [id]);

  return (
    <Wrapper>
      {isCurrentAddressOpen && (
        <EditCurrentAddress
          isCurrentAddressOpen={isCurrentAddressOpen}
          handleCancelAddressOpen={handleCancelAddressOpen}
          isCurrentAddress={isCurrentAddress}
          data={data}
          id={details?.id}
          handleList={handleList}
        />
      )}
      <BasicInfoStyle>
        {passwordModal && (
          <UpdatePassword open={passwordModal} onClose={() => setPasswordModal(false)} />
        )}
        {deleteModal && (
          <ConfirmationModal
            open={deleteModal}
            onCancel={() => setDeleteModal(false)}
            title={'Delete Employee'}
            onSubmit={handleDelete}
            buttonName={'Delete'}
            description={'Are you sure you want to delete this employee?'}
            iconBG={'#FB4A49'}
            icon={<TrashIconNew />}
            loading={deleteLoading}
          />
        )}

        {createModal && (
          <CreateEmployees
            open={createModal}
            onClose={() => setCreateModal(false)}
            handleGetAllEmployees={handleList}
            editDetails={details}
          />
        )}

        <div className="avatar-box">
          {loading ? (
            <div className="profile-img">
              <Skeleton.Avatar active size={96} shape="circle" />
              <Skeleton
                active
                paragraph={{ rows: 1 }}
                style={{ width: '200px', marginLeft: 70 }}
                title={false}
              />
            </div>
          ) : (
            <>
              <CircularProgressBar
                progress={details?.profile_completion || 0}
                component={
                  <div className="profile-img">
                    <AvatarImage
                      key={imageVersion}
                      style={{ width: '120px', height: '120px' }}
                      image={getProfileImage(id) || DefaultProfile}
                      // image={selectedImage || DefaultProfile}
                      name={getFullName(
                        details?.first_name,
                        details?.middle_name,
                        details?.last_name
                      )}
                    />
                    {/* <div className="edit-profile" onClick={handleEditClick}>
                  <EditIcon />
                </div> */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                }
              />
              {canUpdate && (
                <UploadButton onClick={() => fileInputRef.current?.click()}>
                  <p>{uploadText}</p>
                </UploadButton>
              )}
            </>
          )}
          {/* {!loading && (
          <div>
            <h2>
              {getFullName(details?.first_name, details?.middle_name, details?.last_name) || 'N/A'}
            </h2>
            <p style={{ textTransform: 'capitalize' }}>{details?.role?.role || 'N/A'}</p>
          </div>
        )} */}
        </div>
        {/* <div className="info-box">
        <FlexWrapper justify={'space-between'}>
          <h5>Basic Info</h5>
          <FlexWrapper justify={'end'} gap="10px">
            {canUpdate && (
              <UpdateKeyIconBox
                canUpdate={isEmployee ? false : canUpdate}
                onClick={() => {
                  if (canUpdate && !isEmployee) {
                    setPasswordModal(true);
                  }
                }}>
                <UpdateKeyIcon />
              </UpdateKeyIconBox>
            )}
            {canDelete && (
              <DeleteIconBox
                canDelete={user_details?.id === id ? false : canDelete}
                onClick={() => {
                  if (canDelete && user_details?.id !== id) {
                    setDeleteModal(true);
                  }
                }}>
                <DeleteIcon />
              </DeleteIconBox>
            )}
          </FlexWrapper>
        </FlexWrapper>
        {!loading ? (
          <div className="content">
            <div className="contact">
              <p className="title">Employee Name</p>
              <p>
                {getFullName(details?.first_name, details?.middle_name, details?.last_name) ||
                  'N/A'}
              </p>
              <p className="title">Employee ID</p>
              <p>{details?.emp_code || 'N/A'}</p>
              <p className="title">Designation</p>
              <p>{details?.designation || 'N/A'}</p>
              <p className="title">Contact Number</p>
              <p>{details?.contact_number || 'N/A'}</p>
            </div>
            <div className="department">
              <p className="title">Employee Role</p>
              <p style={{ textTransform: 'capitalize' }}>{details?.role?.role || 'N/A'}</p>
              <p className="title">Department</p>
              <p>{details?.department || 'N/A'}</p>
              <p className="title">Official Email</p>
              <p>{details?.email || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        )}
      </div> */}
        <ProfileBox>
          {!loading ? (
            <PersonalInfoStyle>
              <div className="title">
                <h5>Personal Info</h5>
                {canUpdate && (
                  <div className="edit-profile" onClick={() => setCreateModal(true)}>
                    <EditIcon />
                  </div>
                )}
              </div>

              <FlexWrapper wrap="nowrap" align="start" style={{ padding: '20px 0' }}>
                <InfoWrapper>
                  <InfoItem>
                    <p>Name</p>
                    <p className="values" style={{ textTransform: 'unset' }}>
                      :{' '}
                      {getFullName(details?.first_name, details?.middle_name, details?.last_name) ||
                        'N/A'}
                    </p>
                  </InfoItem>
                  <InfoItem>
                    <p>Gender</p>
                    <p className="values">: {details?.gender || 'N/A'}</p>
                  </InfoItem>
                  <InfoItem>
                    <p>D.O.B.</p>
                    <p className="values">
                      :{' '}
                      {details?.date_of_birth
                        ? moment(details?.date_of_birth).format('DD/MM/YYYY')
                        : 'N/A'}
                    </p>
                  </InfoItem>
                  <InfoItem>
                    <p>Blood Group</p>
                    <p className="values">: {details?.blood_group || 'N/A'}</p>
                  </InfoItem>
                  <InfoItem>
                    <p>Marital Status</p>
                    <p className="values">: {details?.martial_status || 'N/A'}</p>
                  </InfoItem>
                  <InfoItem>
                    <p>Contact Number</p>
                    <p className="values">
                      :{formatPhone(details?.contact_number_country_code, details?.contact_number)}
                    </p>
                  </InfoItem>
                </InfoWrapper>
                <FlexWrapper width="5%">
                  <Line />
                </FlexWrapper>

                <InfoWrapper style={{ width: '50%' }}>
                  <InfoItem>
                    <p>Emergancy No.</p>
                    <p className="values">
                      :
                      {formatPhone(
                        details?.emergency_contact_number_country_code,
                        details?.emergency_contact_number
                      )}
                    </p>
                  </InfoItem>
                  <InfoItem>
                    <p>Whatsapp No.</p>
                    <p className="values">
                      :
                      {formatPhone(details?.whatsapp_number_country_code, details?.whatsapp_number)}
                    </p>
                  </InfoItem>
                  <InfoItem>
                    <p>Personal Email</p>
                    <p
                      className="values"
                      style={{ textTransform: 'unset', wordBreak: 'break-all' }}>
                      : {details?.personal_email || 'N/A'}
                    </p>
                  </InfoItem>
                  <InfoItem>
                    <p>UIDAI</p>
                    <p className="values">: {details?.udid ? formatUDID(details.udid) : 'N/A'}</p>
                  </InfoItem>

                  <InfoItem>
                    <p>PAN No.</p>
                    <p className="values">: {details?.pan_no || 'N/A'}</p>
                  </InfoItem>

                  {/* <InfoItem>
                  <p>Current Address </p>
                  {details?.currentAddress?.address_line_one ? (
                    <p className="values tooltip">
                      :{details?.currentAddress?.address_line_one},{' '}
                      {details?.currentAddress?.address_line_two}, {details?.currentAddress?.city},{' '}
                      {details?.currentAddress?.state},{details?.currentAddress?.country}
                    </p>
                  ) : (
                    <p className="values">: N/A</p>
                  )}
                </InfoItem>
                <InfoItem>
                  <p>Permanent Address </p>
                  {details?.permanentAddress?.address_line_one ? (
                    <p className="values tooltip">
                      : {details?.permanentAddress?.address_line_one},{' '}
                      {details?.permanentAddress?.address_line_two},{' '}
                      {details?.permanentAddress?.city}, {details?.permanentAddress?.state},
                      {details?.permanentAddress?.country}
                    </p>
                  ) : (
                    <p className="values">: N/A</p>
                  )}
                </InfoItem> */}
                </InfoWrapper>
              </FlexWrapper>
            </PersonalInfoStyle>
          ) : (
            <Skeleton active paragraph={{ rows: 6 }} title={false} />
          )}
        </ProfileBox>
      </BasicInfoStyle>
      <div className="address-info">
        <div className="address">
          <div className="edit-section">
            <p>Current Address Info</p>
            {canUpdate && (
              <span onClick={() => handleSetIsCurrentAddressOpen('Current')}>
                <EditIcon />
              </span>
            )}
          </div>
          <div className="address-section">
            <div>
              <p>Address</p>
              <h1>{details?.currentAddress?.address_line_one || 'N/A'}</h1>
            </div>
            {details?.currentAddress?.address_line_two && (
              <div>
                <p>Address Line 2</p>
                <h1>{details?.currentAddress?.address_line_two || 'N/A'}</h1>
              </div>
            )}
          </div>
          <div className="about">
            <div className="left">
              <div>
                <p>City</p>
                <h1>{details?.currentAddress?.city || 'N/A'}</h1>
              </div>
              <div>
                <p>State</p>
                <h1>{details?.currentAddress?.state || 'N/A'}</h1>
              </div>
            </div>
            <div className="right">
              <div>
                <p>Country</p>
                <h1>{details?.currentAddress?.country || 'N/A'}</h1>
              </div>
              <div>
                <p>Pincode</p>
                <h1>{details?.currentAddress?.postalcode || 'N/A'}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="address">
          <div className="edit-section">
            <p>Permanent Address Info</p>
            {canUpdate && (
              <span onClick={() => handleSetIsCurrentAddressOpen('Permanent')}>
                <EditIcon />
              </span>
            )}
          </div>
          <div className="address-section">
            <div>
              <p>Address</p>
              <h1>{details?.permanentAddress?.address_line_one || 'N/A'}</h1>
            </div>
            {details?.permanentAddress?.address_line_two && (
              <div>
                <p>Address Line 2</p>
                <h1>{details?.permanentAddress?.address_line_two || 'N/A'}</h1>
              </div>
            )}
          </div>
          <div className="about">
            <div className="left">
              <div>
                <p>City</p>
                <h1>{details?.permanentAddress?.city || 'N/A'}</h1>
              </div>
              <div>
                <p>State</p>
                <h1>{details?.permanentAddress?.state || 'N/A'}</h1>
              </div>
            </div>
            <div className="right">
              <div>
                <p>Country</p>
                <h1>{details?.permanentAddress?.country || 'N/A'}</h1>
              </div>
              <div>
                <p>Pincode</p>
                <h1>{details?.permanentAddress?.postalcode || 'N/A'}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default BasicInfo;

const Wrapper = styled.div`
  .address-info {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    .address {
      width: 100%;
      background: #fff;
      padding: 16px 16px 24px 16px;
      border-radius: 12px;
      .edit-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e3e3e3;
        padding: 12px 0px;
        p {
          font-weight: 700;
          font-size: 20px;
          font-family: 'Plus Jakarta Sans';
          margin: 0px;
        }
        span {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #65beee;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
        }
      }
      .address-section {
        display: flex;
        margin-top: 16px;
        div {
          width: 100%;
          p {
            color: #9f9f9f;
            margin: 0px;
            font-size: 14px;
            font-family: 'Plus Jakarta Sans';
            text-align: left;
          }
          h1 {
            color: #0e0e0e;
            margin: 0px;
            font-weight: 500;
            font-size: 16px;
            font-family: 'Plus Jakarta Sans';
            text-align: left;
          }
        }
      }
      .about {
        display: flex;
        margin-top: 16px;
        .left {
          width: 100%;
          display: flex;
          div {
            width: 100%;
            p {
              color: #9f9f9f;
              margin: 0px;
              font-size: 14px;
              font-family: 'Plus Jakarta Sans';
              text-align: left;
            }
            h1 {
              color: #0e0e0e;
              font-weight: 500;
              font-size: 16px;
              margin: 0px;
              font-family: 'Plus Jakarta Sans';
              text-align: left;
            }
          }
        }
        .right {
          width: 100%;
          display: flex;
          div {
            width: 100%;
            p {
              color: #9f9f9f;
              margin: 0px;
              font-size: 14px;
              font-family: 'Plus Jakarta Sans';
              text-align: left;
            }
            h1 {
              color: #0e0e0e;
              font-weight: 500;
              font-size: 16px;
              margin: 0px;
              font-family: 'Plus Jakarta Sans';
              text-align: left;
            }
          }
        }
      }
    }
  }
`;

const UploadButton = styled.div`
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid #956dff;
  border-radius: 10px;
  margin-top: 20px;
  cursor: pointer;
  p {
    color: #956dff;
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 14px;
    margin: 0 !important;
  }
`;

const InfoWrapper = styled(FlexWrapper)`
  width: 45%;
  justify-content: start;
  flex-wrap: nowrap;
  align-items: start;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled(FlexWrapper)`
  justify-content: start;
  width: 100%;
  align-items: start;

  p {
    width: 40%;
    text-align: left;
    margin: 0;
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 14px;
    color: #767676;
    text-wrap: wrap;
    text-transform: capitalize;
  }

  .values {
    width: 60%;
    color: #0e0e0e;
    display: flex;
    align-items: center;
  }
`;

const Line = styled.div`
  width: 1px;
  background: #c8c8c8;
  height: 200px;
`;
