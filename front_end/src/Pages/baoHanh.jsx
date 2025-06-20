import React from 'react';
import { Clock, Shield, AlertCircle, CheckCircle, Phone, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WarrantyPolicy = () => {
    const { t } = useTranslation();
    
    const warrantyData = [
        {
            product: t('warranty.table.newDevice'),
            period: t('warranty.table.newDevicePeriod'),
            decision: t('warranty.table.newDeviceDecision'),
            location: t('warranty.table.newDeviceLocation')
        },
        {
            product: t('warranty.table.activatedDevice'),
            period: t('warranty.table.activatedDevicePeriod'),
            decision: t('warranty.table.activatedDeviceDecision'),
            location: t('warranty.table.activatedDeviceLocation')
        },
        {
            product: t('warranty.table.usedDevice'),
            period: t('warranty.table.usedDevicePeriod'),
            decision: t('warranty.table.usedDeviceDecision'),
            location: t('warranty.table.usedDeviceLocation')
        }
    ];

    const warrantyConditions = [
        t('warranty.conditions.condition1'),
        t('warranty.conditions.condition2')
    ];

    const exclusions = [
        t('warranty.exclusions.exclusion1'),
        t('warranty.exclusions.exclusion2'),
        t('warranty.exclusions.exclusion3'),
        t('warranty.exclusions.exclusion4')
    ];

    const additionalNotes = [
        t('warranty.additionalNotes.note1'),
        t('warranty.additionalNotes.note2'),
        t('warranty.additionalNotes.note3')
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    {t('warranty.title')}
                </h1>
                <p className="text-center text-gray-600 text-sm mb-8">
                    {t('warranty.subtitle')}
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <p className="text-gray-700 text-sm">
                        {t('warranty.policyDescription')}
                    </p>
                </div>

                {/* Warranty Table */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {t('warranty.standardWarranty')}
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm rounded-lg">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="border border-gray-300 p-3 text-left font-semibold">{t('warranty.table.headers.product')}</th>
                                    <th className="border border-gray-300 p-3 text-left font-semibold">{t('warranty.table.headers.period')}</th>
                                    <th className="border border-gray-300 p-3 text-left font-semibold">{t('warranty.table.headers.decision')}</th>
                                    <th className="border border-gray-300 p-3 text-left font-semibold">{t('warranty.table.headers.location')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {warrantyData.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="border border-gray-300 p-3">{item.product}</td>
                                        <td className="border border-gray-300 p-3">{item.period}</td>
                                        <td className="border border-gray-300 p-3">{item.decision}</td>
                                        <td className="border border-gray-300 p-3">{item.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Product Categories */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {t('warranty.categories.phones')}
                        </h3>
                        <p className="text-sm text-green-700 mb-2">{t('warranty.categories.phonesPeriod')}</p>
                        <ul className="text-sm text-green-700 space-y-1">
                            {warrantyConditions.map((condition, index) => (
                                <li key={index}>• {condition}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="font-semibold text-purple-800 mb-3">{t('warranty.categories.samsungWatch')}</h3>
                        <p className="text-sm text-purple-700 mb-2">{t('warranty.categories.samsungWatchPeriod')}</p>
                        <ul className="text-sm text-purple-700 space-y-1">
                            {warrantyConditions.map((condition, index) => (
                                <li key={index}>• {condition}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h3 className="font-semibold text-orange-800 mb-3">{t('warranty.categories.laptop')}</h3>
                        <p className="text-sm text-orange-700 mb-2">{t('warranty.categories.laptopPeriod')}</p>
                        <ul className="text-sm text-orange-700 space-y-1">
                            {warrantyConditions.map((condition, index) => (
                                <li key={index}>• {condition}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-3">{t('warranty.categories.accessories')}</h3>
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm font-medium text-gray-700">{t('warranty.categories.accessoriesNew')}</p>
                                <p className="text-xs text-gray-600">{t('warranty.categories.accessoriesNewPeriod')}</p>
                                <p className="text-xs text-gray-600">{t('warranty.categories.accessoriesNewNote')}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">{t('warranty.categories.accessoriesUsed')}</p>
                                <p className="text-xs text-gray-600">{t('warranty.categories.accessoriesUsedNote')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Extended Warranty */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                    <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {t('warranty.extended.accessoriesTitle')}
                    </h3>
                    <p className="text-sm text-yellow-700 mb-2">{t('warranty.extended.accessoriesPeriod')}</p>
                    <p className="text-sm text-yellow-700">
                        {t('warranty.extended.accessoriesCondition1')}
                    </p>
                    <p className="text-sm text-yellow-700">
                        {t('warranty.extended.accessoriesCondition2')}
                    </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />{t('warranty.extended.extendedWarranty')}
                    </h3>
                    <p className="text-sm text-red-700 mb-2">{t('warranty.extended.extendedPeriod')}</p>
                    <p className="text-sm text-red-700">{t('warranty.extended.extendedCondition')}
                    </p>
                </div>

                {/* Exclusions */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        {t('warranty.notes.title')}
                    </h3>
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <h4 className="font-semibold text-red-800 mb-2">{t('warranty.notes.conditionsTitle')}</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                            <li>• {t('warranty.notes.conditionGeneral')}</li>
                            {exclusions.map((exclusion, index) => (
                                <li key={index}>• {exclusion}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Additional Notes */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('warranty.additional.title')}</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="text-sm text-gray-700 space-y-2">
                            {additionalNotes.map((note, index) => (
                                <li key={index}>• {note}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Warranty Information */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-3">{t('warranty.info.laptopTerms')}</h3>
                        <p className="text-sm text-blue-700 mb-2">
                            {t('warranty.info.laptopDescription1')}
                        </p>
                        <p className="text-sm text-blue-700">
                            {t('warranty.info.laptopDescription2')}
                        </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-3">{t('warranty.info.warrantyCenter')}</h3>
                        <ul className="text-sm text-green-700 space-y-1">
                            <li>• {t('warranty.info.centerWebsite')}</li>
                            <li>• {t('warranty.info.processingTime')}</li>
                            <li>• {t('warranty.info.notification')}</li>
                        </ul>
                    </div>
                </div>

                {/* Warranty Duration */}
                <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {t('warranty.accessories.title')}
                    </h3>
                    <ul className="text-sm text-indigo-700 space-y-1">
                        <li>• {t('warranty.accessories.vinsmart')}</li>
                        <li>• {t('warranty.accessories.asus')}</li>
                        <li>• {t('warranty.accessories.nokia')}</li>
                    </ul>
                    <p className="text-xs text-indigo-600 mt-2">
                        {t('warranty.accessories.note')}
                    </p>
                </div>

                {/* Contact */}
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-700 flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" />
                        {t('warranty.contact.title')}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                        {t('warranty.contact.description')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WarrantyPolicy;